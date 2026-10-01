import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

// 1. Load environment variables from .env.local if present
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

console.log('====================================================');
console.log('   ARKCA Recyclers - Server-Side SMTP Email Test    ');
console.log('====================================================\n');

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || '587', 10);
const secure = process.env.SMTP_SECURE === 'true' || port === 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || (user ? `"ARKCA Corporate" <${user}>` : undefined);

const recipients = process.env.ENQUIRY_RECEIVER_EMAIL
  ? process.env.ENQUIRY_RECEIVER_EMAIL.split(',').map((s) => s.trim()).filter(Boolean)
  : [
      process.env.EMAIL_TO_1,
      process.env.EMAIL_TO_2,
      process.env.EMAIL_TO_3,
    ].filter(Boolean);

if (!host || !user || !pass) {
  console.log('⚠️  SMTP credentials are not yet configured in environment.');
  console.log('\nTo configure, set the following environment variables:');
  console.log('----------------------------------------------------');
  console.log('SMTP_HOST=smtp.example.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_USER=user@example.com');
  console.log('SMTP_PASSWORD=your-password');
  console.log('SMTP_FROM="ARKCA Corporate" <noreply@example.com>');
  console.log('ENQUIRY_RECEIVER_EMAIL=recipient@example.com');
  console.log('----------------------------------------------------\n');
  process.exit(0);
}

if (recipients.length === 0) {
  console.error('❌ No recipients found. Please set EMAIL_TO_1, EMAIL_TO_2, or EMAIL_TO_3 in environment.');
  process.exit(1);
}

console.log(`Connecting to SMTP Server: ${host}:${port} (secure: ${secure})`);
console.log(`Configured recipient count: ${recipients.length}`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
});

async function runEmailTest() {
  try {
    console.log('\n[1/2] Verifying SMTP server connection & credentials...');
    await transporter.verify();
    console.log('✅ SMTP connection authenticated successfully!');

    console.log('\n[2/2] Sending test enquiry notification email to all recipients...');
    const info = await transporter.sendMail({
      from,
      to: recipients.join(', '),
      subject: 'New Website Enquiry - ARKCA Corporate (Test Dispatch)',
      text: `This is a test notification confirming that the ARKCA Recyclers server-side email dispatch is operational.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #168052; border-radius: 8px;">
          <h2 style="color: #168052;">ARKCA Recyclers - Email Dispatch Verified</h2>
          <p>This email confirms that server-side email notifications are working properly.</p>
          <p><strong>Recipients Count:</strong> ${recipients.length}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</p>
        </div>
      `,
    });

    console.log('✅ Email successfully dispatched!');
    console.log(`   - Message ID: ${info.messageId}`);
    console.log(`   - Accepted count: ${info.accepted.length}`);
    console.log('\n====================================================');
    console.log('🎉 EMAIL DISPATCH VERIFIED SUCCESSFULLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ SMTP Dispatch Failed:');
    console.error(err.message);
    process.exit(1);
  }
}

runEmailTest();
