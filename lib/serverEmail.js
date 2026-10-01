import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

/**
 * Ensures environment variables from .env.local are accessible
 * in development environments without requiring manual restart.
 */
function ensureEnvLoaded() {
  if (!process.env.SMTP_HOST || (!process.env.SMTP_PASSWORD && !process.env.SMTP_PASS)) {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        });
      }
    } catch {}
  }
}

/**
 * Escape raw strings to prevent HTML injection in emails
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Convert user multiline text to safe HTML with <br/> tags
 */
export function formatMultilineHtml(str) {
  if (!str || !String(str).trim()) {
    return '<span style="color: #9ca3af; font-style: italic;">No additional message provided.</span>';
  }
  return escapeHtml(str).replace(/\r?\n/g, '<br/>');
}

/**
 * Get configured SMTP credentials
 */
export function getSmtpConfig() {
  ensureEnvLoaded();
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'corporate@arkcarecyclers.com';
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';
  const from = process.env.SMTP_FROM || (user ? `"ARKCA Corporate" <${user}>` : '"ARKCA Corporate" <corporate@arkcarecyclers.com>');
  
  // Destination receiver email(s) - strictly corporate@arkcarecyclers.com as default
  const receiverEmail = process.env.ENQUIRY_RECEIVER_EMAIL || [
    process.env.EMAIL_TO_1,
    process.env.EMAIL_TO_2,
    process.env.EMAIL_TO_3,
  ].filter(Boolean).join(', ') || 'corporate@arkcarecyclers.com';

  return { host, port, user, pass, from, receiverEmail };
}

/**
 * Create a configured Nodemailer transporter
 */
export function createTransporter(overridePort = null, overrideSecure = null) {
  const { host, port, user, pass } = getSmtpConfig();

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials are not configured. Please set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in environment variables.');
  }

  const selectedPort = overridePort !== null ? overridePort : port;
  const isSecure = overrideSecure !== null ? overrideSecure : selectedPort === 465;

  return nodemailer.createTransport({
    host,
    port: selectedPort,
    secure: isSecure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Send Professional HTML Enquiry Email via SMTP
 * 
 * @param {Object} params
 * @param {string} params.user_name
 * @param {string} params.phone_no
 * @param {string} params.user_email
 * @param {string} params.company
 * @param {string} params.purpose
 * @param {string} params.message
 * @param {Object} [params.extraFields]
 * @param {string} [params.formName]
 * @param {string} [params.pageName]
 * @param {string} [params.enquiryId]
 * @returns {Promise<{ success: boolean, messageId?: string, error?: string }>}
 */
export async function sendEnquiryEmail({
  user_name = '',
  phone_no = '',
  user_email = '',
  company = '',
  purpose = '',
  message = '',
  extraFields = {},
  formName = 'Website Enquiry',
  pageName = 'Website',
  enquiryId = '',
}) {
  const { from, receiverEmail } = getSmtpConfig();

  if (!receiverEmail) {
    return {
      success: false,
      error: 'ENQUIRY_RECEIVER_EMAIL is not configured.',
    };
  }

  const safeName = escapeHtml(user_name) || 'Not provided';
  const safePhone = escapeHtml(phone_no);
  const safeEmail = escapeHtml(user_email);
  const safeCompany = escapeHtml(company);
  const safePurpose = escapeHtml(purpose) || 'General Enquiry';
  const safeMessageHtml = formatMultilineHtml(message);

  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  }) + ' (IST)';

  // Build any extra field rows (e.g. Pincode, City, Weight)
  let extraRowsHtml = '';
  if (extraFields && typeof extraFields === 'object') {
    extraRowsHtml = Object.entries(extraFields)
      .map(([k, v]) => {
        const label = escapeHtml(
          k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (s) => s.toUpperCase())
        );
        return `
          <tr>
            <td style="padding: 10px 0; color: #6b7280; width: 32%; vertical-align: top; font-weight: 600; border-top: 1px solid #f3f4f6;">${label}</td>
            <td style="padding: 10px 0; color: #111827; width: 68%; vertical-align: top; border-top: 1px solid #f3f4f6;">${escapeHtml(v)}</td>
          </tr>
        `;
      })
      .join('');
  }

  // Check if logo exists for inline CID embedding
  const attachments = [];
  const logoPath = path.resolve(process.cwd(), 'public/images/logo/arkcarecyclerslogo.png');
  let logoHtml = '<div style="font-size: 20px; font-weight: 800; color: #0e5b3b; letter-spacing: 0.04em;">ARKCA CORPORATE</div>';

  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: 'arkca-logo.png',
      path: logoPath,
      cid: 'arkcalogo',
    });
    logoHtml = `
      <img src="cid:arkcalogo" alt="ARKCA Corporate" width="160" style="display: block; max-width: 160px; height: auto; border: 0;" />
    `;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Website Enquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827;">
  <!-- Preview text -->
  <div style="display: none; font-size: 1px; color: #f4f5f7; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    New enquiry received through the ARKCA Corporate website.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #e5e7eb;">
              ${logoHtml}
              <h1 style="margin: 20px 0 6px 0; font-size: 22px; font-weight: 700; color: #111827; letter-spacing: -0.02em;">
                New Enquiry Received
              </h1>
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
                A new enquiry has been submitted through your website.
              </p>
            </td>
          </tr>

          <!-- Enquiry Details Section -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0 0 16px 0; font-size: 12px; font-weight: 700; color: #0e5b3b; text-transform: uppercase; letter-spacing: 0.08em;">
                ENQUIRY DETAILS
              </h2>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; border-collapse: collapse;">
                ${enquiryId ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; width: 32%; vertical-align: top; font-weight: 600;">Enquiry ID</td>
                  <td style="padding: 8px 0; color: #0e5b3b; width: 68%; vertical-align: top; font-weight: 700;">${escapeHtml(enquiryId)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; width: 32%; vertical-align: top; font-weight: 600; ${enquiryId ? 'border-top: 1px solid #f3f4f6;' : ''}">Name</td>
                  <td style="padding: 8px 0; color: #111827; width: 68%; vertical-align: top; font-weight: 600; ${enquiryId ? 'border-top: 1px solid #f3f4f6;' : ''}">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; vertical-align: top; font-weight: 600; border-top: 1px solid #f3f4f6;">Phone</td>
                  <td style="padding: 8px 0; color: #111827; vertical-align: top; border-top: 1px solid #f3f4f6;">
                    ${safePhone ? `<a href="tel:${safePhone}" style="color: #0e5b3b; text-decoration: none; font-weight: 500;">${safePhone}</a>` : '<span style="color: #9ca3af;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; vertical-align: top; font-weight: 600; border-top: 1px solid #f3f4f6;">Email</td>
                  <td style="padding: 8px 0; color: #111827; vertical-align: top; border-top: 1px solid #f3f4f6;">
                    ${safeEmail ? `<a href="mailto:${safeEmail}" style="color: #0e5b3b; text-decoration: underline;">${safeEmail}</a>` : '<span style="color: #9ca3af;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; vertical-align: top; font-weight: 600; border-top: 1px solid #f3f4f6;">Company</td>
                  <td style="padding: 8px 0; color: #111827; vertical-align: top; border-top: 1px solid #f3f4f6;">
                    ${safeCompany || '<span style="color: #9ca3af;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; vertical-align: top; font-weight: 600; border-top: 1px solid #f3f4f6;">Purpose</td>
                  <td style="padding: 8px 0; color: #111827; vertical-align: top; font-weight: 600; border-top: 1px solid #f3f4f6;">${safePurpose}</td>
                </tr>
                ${extraRowsHtml}
              </table>
            </td>
          </tr>

          <!-- Message Section -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #0e5b3b; text-transform: uppercase; letter-spacing: 0.08em;">
                MESSAGE
              </h2>
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #168052; border-radius: 6px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #1f2937;">
                ${safeMessageHtml}
              </div>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; font-size: 12px; color: #6b7280; line-height: 1.6;">
              <p style="margin: 0 0 4px 0;"><strong>Submitted through:</strong> ARKCA Corporate Website</p>
              <p style="margin: 0;"><strong>Date &amp; Time:</strong> ${timestamp}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const plainTextContent = `
New Website Enquiry — ${user_name || 'Valued Client'}
--------------------------------------------------
ENQUIRY DETAILS:
${enquiryId ? `Enquiry ID: ${enquiryId}\n` : ''}Name:       ${user_name || 'Not provided'}
Phone:      ${phone_no || 'Not provided'}
Email:      ${user_email || 'Not provided'}
Company:    ${company || 'Not provided'}
Purpose:    ${purpose || 'General Enquiry'}

MESSAGE:
${message || 'No additional message provided.'}

--------------------------------------------------
Submitted through: ARKCA Corporate Website
Date & Time:       ${timestamp}
  `.trim();

  const mailOptions = {
    from,
    to: receiverEmail,
    replyTo: user_email || undefined,
    subject: `New Website Enquiry — ${user_name || 'Valued Client'}`,
    text: plainTextContent,
    html: htmlContent,
    attachments,
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (primaryErr) {
    const isRateLimit = /ratelimit|451|too many/i.test(primaryErr.message || '');
    if (isRateLimit) {
      console.warn('[serverEmail] Hostinger SMTP rate limit active:', primaryErr.message);
      return {
        success: false,
        error: primaryErr.message,
      };
    }

    console.warn('[serverEmail] Primary SMTP attempt failed:', primaryErr.message, 'Trying port 587 STARTTLS fallback...');
    try {
      const fallbackTransporter = createTransporter(587, false);
      const info = await fallbackTransporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (fallbackErr) {
      console.error('[serverEmail] Both SMTP transport attempts failed:', fallbackErr);
      return {
        success: false,
        error: fallbackErr.message,
      };
    }
  }
}
