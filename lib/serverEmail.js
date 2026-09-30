import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

/**
 * Ensures environment variables from .env.local are accessible
 * even during hot development without restarting the server.
 */
function ensureEnvLoaded() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
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

export function getRecipients() {
  ensureEnvLoaded();
  return [
    process.env.EMAIL_TO_1 || 'contact@arkcarecyclers.com',
    process.env.EMAIL_TO_2 || 'certificate@arkcacorporate.com',
    process.env.EMAIL_TO_3 || 'ankitaarkca@gmail.com',
  ].filter(Boolean);
}

/**
 * Checks whether SMTP credentials have been provided in environment
 * @returns {boolean}
 */
export function isEmailConfigured() {
  ensureEnvLoaded();
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return Boolean(host && user && pass);
}

/**
 * Creates and returns a Nodemailer transporter instance
 * @returns {nodemailer.Transporter | null}
 */
export function getEmailTransporter() {
  if (!isEmailConfigured()) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Useful timeout options for production stability
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Sends a notification email to the 3 configured recipient addresses
 * 
 * @param {Object} enquiry
 * @returns {Promise<{ success: boolean, messageId?: string, reason?: string }>}
 */
export async function sendEnquiryNotification(enquiry) {
  if (!isEmailConfigured()) {
    console.warn(
      '[serverEmail] SMTP credentials are not configured in environment variables. Email notification skipped for enquiry ID:',
      enquiry._id || enquiry.name || 'untracked'
    );
    return {
      success: false,
      reason: 'unconfigured',
      message: 'SMTP credentials not configured.',
    };
  }

  const transporter = getEmailTransporter();
  if (!transporter) {
    return { success: false, reason: 'unconfigured' };
  }

  const submissionDate = enquiry.createdAt
    ? new Date(enquiry.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const senderFrom =
    process.env.SMTP_FROM || `"ARKCA Recyclers Website" <${process.env.SMTP_USER}>`;

  // Format any extra metadata fields into table rows
  let extraRowsHtml = '';
  if (enquiry.metadata && typeof enquiry.metadata === 'object') {
    extraRowsHtml = Object.entries(enquiry.metadata)
      .filter(([k]) => k !== 'honeypot')
      .map(([key, val]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (s) => s.toUpperCase());
        return `
          <tr>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; width: 35%; background: #f9fafb;">${formattedKey}</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827;">${val || 'N/A'}</td>
          </tr>
        `;
      })
      .join('');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Website Enquiry</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px; color: #1f2937;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #e5e7eb;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0e5b3b 0%, #168052 100%); padding: 28px 32px; text-align: left;">
              <span style="background: rgba(255, 255, 255, 0.2); color: #ffffff; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;">
                ${enquiry.formType ? enquiry.formType.toUpperCase() : 'WEBSITE'} ENQUIRY
              </span>
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 12px 0 4px 0; line-height: 1.3;">
                New Website Lead Received
              </h1>
              <p style="color: rgba(255, 255, 255, 0.85); font-size: 13px; margin: 0;">
                Submitted via ${enquiry.formName || 'ARKCA Website'} (${enquiry.pageName || 'Home'})
              </p>
            </td>
          </tr>

          <!-- Summary Table -->
          <tr>
            <td style="padding: 28px 32px;">
              <h2 style="font-size: 15px; color: #111827; font-weight: 700; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.04em;">
                Primary Contact Details
              </h2>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; width: 35%; background: #f9fafb;">Name / Contact</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">${enquiry.name || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; background: #f9fafb;">Email Address</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                    ${enquiry.email ? `<a href="mailto:${enquiry.email}" style="color: #0e5b3b; text-decoration: underline; font-weight: 500;">${enquiry.email}</a>` : 'Not provided'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; background: #f9fafb;">Phone Number</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827;">
                    ${enquiry.phone ? `<a href="tel:${enquiry.phone}" style="color: #0e5b3b; text-decoration: none; font-weight: 500;">${enquiry.phone}</a>` : 'Not provided'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; background: #f9fafb;">Company / Business</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #111827;">${enquiry.company || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; background: #f9fafb;">Service / Category</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #0e5b3b; font-weight: 600;">${enquiry.service || 'General Inquiry'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; background: #f9fafb;">Submission Time</td>
                  <td style="padding: 10px 14px; border-bottom: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;">${submissionDate} (IST)</td>
                </tr>
                ${extraRowsHtml}
              </table>

              <!-- Message Section -->
              <div style="margin-top: 24px;">
                <h2 style="font-size: 15px; color: #111827; font-weight: 700; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.04em;">
                  Submitted Message / Request Details
                </h2>
                <div style="background-color: #f9fafb; border-left: 4px solid #0e5b3b; border-radius: 4px; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">
                  ${enquiry.message || 'No additional message provided.'}
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
              <p style="margin: 0 0 6px 0;">This email was automatically generated by the <strong>ARKCA Recyclers Portal</strong>.</p>
              <p style="margin: 0; color: #9ca3af;">Saved permanently to MongoDB Atlas database: <code>arkca_recyclers.enquiries</code></p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const recipients = getRecipients();
    const info = await transporter.sendMail({
      from: senderFrom,
      to: recipients.join(', '),
      replyTo: enquiry.email || undefined,
      subject: 'New Website Enquiry - ARKCA Corporate',
      text: `
New Website Enquiry - ARKCA Corporate
-----------------------------------------
Form: ${enquiry.formName || 'Website'} (${enquiry.formType || 'General'})
Page: ${enquiry.pageName || 'Home'}
Date: ${submissionDate} (IST)

Name: ${enquiry.name || 'N/A'}
Email: ${enquiry.email || 'N/A'}
Phone: ${enquiry.phone || 'N/A'}
Company: ${enquiry.company || 'N/A'}
Service: ${enquiry.service || 'N/A'}

Message:
${enquiry.message || 'N/A'}
      `.trim(),
      html: htmlContent,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err) {
    console.error('[serverEmail] Failed to send notification email:', err);
    return {
      success: false,
      reason: 'send_error',
      error: err.message,
    };
  }
}
