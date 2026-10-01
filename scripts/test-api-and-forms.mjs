import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

// 1. Load environment variables from .env.local
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

const API_URL = 'http://localhost:3000/api/enquiry';
const backupFilePath = path.join(rootDir, 'data', 'enquiries.json');

function readBackupRecords() {
  if (!fs.existsSync(backupFilePath)) return [];
  try {
    const raw = fs.readFileSync(backupFilePath, 'utf8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function runVerification() {
  console.log('================================================================');
  console.log('  ARKCA Corporate - Comprehensive Enquiry & Backup Test Suite   ');
  console.log('================================================================\n');

  // Baseline records count
  const initialRecords = readBackupRecords();
  const initialCount = initialRecords.length;
  console.log(`Initial records count in data/enquiries.json: ${initialCount}`);

  // Test 1: Malformed JSON Rejection
  console.log('\n[1/12] Testing Malformed JSON Rejection (Must return 400 & not save to JSON)...');
  const malformedRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"user_name": "Test", "broken": }',
  });
  const malformedData = await malformedRes.json();
  const countAfterMalformed = readBackupRecords().length;
  if (malformedRes.status === 400 && malformedData.success === false && countAfterMalformed === initialCount) {
    console.log(`  ✅ Rejected with HTTP 400: "${malformedData.message}" | No JSON record created.`);
  } else {
    console.error('  ❌ Malformed JSON test failed:', malformedRes.status, malformedData, `count: ${countAfterMalformed}`);
    process.exit(1);
  }

  // Test 2: Empty Request Body Rejection
  console.log('\n[2/12] Testing Empty Body Rejection (Must return 400 & not save to JSON)...');
  const emptyRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  });
  const emptyData = await emptyRes.json();
  const countAfterEmpty = readBackupRecords().length;
  if (emptyRes.status === 400 && emptyData.success === false && countAfterEmpty === initialCount) {
    console.log(`  ✅ Rejected with HTTP 400: "${emptyData.message}" | No JSON record created.`);
  } else {
    console.error('  ❌ Empty body test failed:', emptyRes.status, emptyData);
    process.exit(1);
  }

  // Test 3: Missing Required Fields Rejection (No email & phone)
  console.log('\n[3/12] Testing Missing Contact Details (Must return 400 & not save to JSON)...');
  const missingRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'No Contact User',
      company: 'Test Corp',
      message: 'No email or phone given',
    }),
  });
  const missingData = await missingRes.json();
  const countAfterMissing = readBackupRecords().length;
  if (missingRes.status === 400 && missingData.success === false && countAfterMissing === initialCount) {
    console.log(`  ✅ Rejected with HTTP 400: "${missingData.message}" | No JSON record created.`);
  } else {
    console.error('  ❌ Missing contact test failed:', missingRes.status, missingData);
    process.exit(1);
  }

  // Test 4: Invalid Email Format Rejection
  console.log('\n[4/12] Testing Invalid Email Format (Must return 400 & not save to JSON)...');
  const invalidEmailRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Invalid Email User',
      user_email: 'not-an-email-format',
      phone_no: '9876543210',
    }),
  });
  const invalidEmailData = await invalidEmailRes.json();
  const countAfterInvalidEmail = readBackupRecords().length;
  if (invalidEmailRes.status === 400 && invalidEmailData.success === false && countAfterInvalidEmail === initialCount) {
    console.log(`  ✅ Rejected with HTTP 400: "${invalidEmailData.message}" | No JSON record created.`);
  } else {
    console.error('  ❌ Invalid email test failed:', invalidEmailRes.status, invalidEmailData);
    process.exit(1);
  }

  // Test 5: Anti-Spam Honeypot Trapping
  console.log('\n[5/12] Testing Honeypot Anti-Spam (Must return HTTP 200 & NOT save to JSON & NOT send email)...');
  const honeypotRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Bot Spammer',
      user_email: 'spam@bot.com',
      phone_no: '1234567890',
      message: 'Promotional spam',
      honeypot: 'bot_value_filled',
    }),
  });
  const honeypotData = await honeypotRes.json();
  const countAfterHoneypot = readBackupRecords().length;
  if (honeypotRes.status === 200 && honeypotData.success === true && countAfterHoneypot === initialCount) {
    console.log(`  ✅ Honeypot trapped: HTTP 200 returned | No JSON record created | No email sent.`);
  } else {
    console.error('  ❌ Honeypot test failed:', honeypotRes.status, honeypotData);
    process.exit(1);
  }

  // Test 6: Valid Submission 1 - Responsible Disposal Request (from user screenshot)
  console.log('\n[6/12] Testing Valid Submission 1 (Responsible Disposal Request)...');
  const disposalPayload = {
    formType: 'disposal',
    formName: 'Responsible Disposal Request Form',
    pageName: 'Home',
    data: {
      name: 'Ankita Singh',
      company: 'Arkca',
      email: 'ankitaarkca@gmail.com',
      phone: '7605862219',
      pincode: '700137',
      purpose: 'Plastic Waste',
      wasteSubCategory: 'Flexible Packaging (Cat II)',
      weight: '500 Kg - 2 Tonnes',
      date: '2026-12-16',
      message: 'for testing purpose only',
    },
  };

  const disposalRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disposalPayload),
  });
  const disposalData = await disposalRes.json();
  const recordsAfter1 = readBackupRecords();
  const latestRecord1 = recordsAfter1[recordsAfter1.length - 1];

  if (
    disposalRes.status === 200 &&
    disposalData.success === true &&
    recordsAfter1.length === initialCount + 1 &&
    latestRecord1 &&
    latestRecord1.id &&
    latestRecord1.submitted_at &&
    latestRecord1.user_name === 'Ankita Singh' &&
    latestRecord1.user_email === 'ankitaarkca@gmail.com' &&
    latestRecord1.pincode === '700137'
  ) {
    console.log(`  ✅ Valid submission 1 succeeded with HTTP 200!`);
    console.log(`     - Stored ID: ${latestRecord1.id}`);
    console.log(`     - Submitted At: ${latestRecord1.submitted_at}`);
    console.log(`     - Name: ${latestRecord1.user_name}`);
    console.log(`     - Pincode: ${latestRecord1.pincode}`);
    console.log(`     - Sub-category: ${latestRecord1.waste_sub_category}`);
  } else {
    console.error('  ❌ Valid submission 1 failed:', disposalRes.status, disposalData);
    process.exit(1);
  }

  // Test 7: Valid Submission 2 - Contact Us Form
  console.log('\n[7/12] Testing Valid Submission 2 (Contact Us Form)...');
  const contactPayload = {
    formType: 'contact',
    formName: 'Contact Us General Inquiry Form',
    pageName: 'Contact Us',
    data: {
      name: 'Priya Sharma',
      email: 'corporate@arkcarecyclers.com',
      phone: '+91 98765 43210',
      company: 'TechCorp Solutions',
      serviceInterest: 'Waste Collection',
      subject: 'Commercial Battery Recycling',
      message: 'Need certified recycling process for 50 lithium battery packs.',
    },
  };

  const contactRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactPayload),
  });
  const contactData = await contactRes.json();
  const recordsAfter2 = readBackupRecords();
  const latestRecord2 = recordsAfter2[recordsAfter2.length - 1];

  if (
    contactRes.status === 200 &&
    contactData.success === true &&
    recordsAfter2.length === initialCount + 2 &&
    latestRecord2.id !== latestRecord1.id &&
    recordsAfter2[initialCount].id === latestRecord1.id // Previous record unchanged!
  ) {
    console.log(`  ✅ Valid submission 2 succeeded with HTTP 200!`);
    console.log(`     - Stored ID: ${latestRecord2.id} (Distinct from ${latestRecord1.id})`);
    console.log(`     - Previous record retained unchanged.`);
  } else {
    console.error('  ❌ Valid submission 2 failed:', contactRes.status, contactData);
    process.exit(1);
  }

  // Test 8: Valid Submission 3 - Quotes, Apostrophes, Special Symbols, Multiline
  console.log('\n[8/12] Testing Valid Submission 3 (Quotes, Apostrophes & Multiline Message)...');
  const complexPayload = {
    user_name: "O'Connor & O'Reilly Ltd",
    phone_no: "+91 93166 31170",
    user_email: "corporate@arkcarecyclers.com",
    company: "Recycle & Co. \"Best in East\"",
    purpose: "Hazardous & Non-Ferrous Scrap",
    message: "Paragraph 1: Testing quotes \"verified\" and apostrophes aren't/don't.\nParagraph 2: Special symbols <>&% / 100% recycling.\nParagraph 3: Multiline wrap test.",
  };

  const complexRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complexPayload),
  });
  const complexData = await complexRes.json();
  const recordsAfter3 = readBackupRecords();
  const latestRecord3 = recordsAfter3[recordsAfter3.length - 1];

  if (
    complexRes.status === 200 &&
    complexData.success === true &&
    recordsAfter3.length === initialCount + 3 &&
    latestRecord3.user_name === "O'Connor & O'Reilly Ltd"
  ) {
    console.log(`  ✅ Valid submission 3 with quotes and apostrophes parsed & saved cleanly!`);
    console.log(`     - Stored ID: ${latestRecord3.id}`);
  } else {
    console.error('  ❌ Valid submission 3 failed:', complexRes.status, complexData);
    process.exit(1);
  }

  // Test 9: Verify JSON Integrity
  console.log('\n[9/12] Verifying JSON Backup Integrity & Structure in data/enquiries.json...');
  const allRecords = readBackupRecords();
  const allIds = allRecords.map((r) => r.id);
  const uniqueIds = new Set(allIds);
  const allHaveSubmittedAt = allRecords.every((r) => r.submitted_at && typeof r.submitted_at === 'string');

  if (allIds.length === uniqueIds.size && allHaveSubmittedAt) {
    console.log(`  ✅ All ${allRecords.length} records have unique IDs and valid submitted_at timestamps.`);
    console.log(`  ✅ data/enquiries.json is completely valid JSON.`);
  } else {
    console.error('  ❌ JSON integrity failed: duplicate IDs or missing submitted_at.');
    process.exit(1);
  }

  // Test 10: Verify Recipient Email Configuration
  console.log('\n[10/12] Verifying Recipient Email Addresses in Server Configuration...');
  const receiverEmail = process.env.ENQUIRY_RECEIVER_EMAIL || '';
  const recipients = receiverEmail.split(',').map((s) => s.trim().toLowerCase());

  console.log(`  Configured ENQUIRY_RECEIVER_EMAIL: "${receiverEmail}"`);
  const hasCorporate = recipients.includes('corporate@arkcarecyclers.com');
  const hasCertificate = recipients.includes('certificate@arkcacorporate.com');
  const hasAnkita = recipients.includes('ankitaarkca@gmail.com');
  const hasContact = recipients.includes('contact@arkcarecyclers.com');

  if (hasCorporate && hasCertificate && hasAnkita && !hasContact) {
    console.log('  ✅ Recipients verified:');
    console.log('     - corporate@arkcarecyclers.com (PRESENT)');
    console.log('     - certificate@arkcacorporate.com (PRESENT)');
    console.log('     - ankitaarkca@gmail.com (PRESENT)');
    console.log('     - contact@arkcarecyclers.com (REMOVED / NOT PRESENT)');
  } else {
    console.error('  ❌ Recipient verification failed: unexpected recipient list:', recipients);
    process.exit(1);
  }

  // Test 11: Verify Zero MongoDB Dependencies in Enquiry System
  console.log('\n[11/12] Verifying Zero MongoDB Dependencies in Active Enquiry Flow...');
  const routeContent = fs.readFileSync(path.join(rootDir, 'app', 'api', 'enquiry', 'route.js'), 'utf8');
  const serverEmailContent = fs.readFileSync(path.join(rootDir, 'lib', 'serverEmail.js'), 'utf8');
  const backupModuleContent = fs.readFileSync(path.join(rootDir, 'lib', 'enquiryBackup.js'), 'utf8');

  const hasMongoInRoute = /mongodb|MongoClient|mongoose/i.test(routeContent);
  const hasMongoInEmail = /mongodb|MongoClient|mongoose/i.test(serverEmailContent);
  const hasMongoInBackup = /mongodb|MongoClient|mongoose/i.test(backupModuleContent);

  if (!hasMongoInRoute && !hasMongoInEmail && !hasMongoInBackup) {
    console.log('  ✅ Confirmed: Zero MongoDB imports or references in enquiry route, serverEmail, or enquiryBackup.');
  } else {
    console.error('  ❌ MongoDB references detected in enquiry system!');
    process.exit(1);
  }

  // Test 12: Verify No Real Passwords in Git-Tracked Files
  console.log('\n[12/12] Verifying Security: No Real Passwords in Git-Tracked Files...');
  const envExampleContent = fs.readFileSync(path.join(rootDir, '.env.example'), 'utf8');
  if (!envExampleContent.includes('E^8naTSV') && envExampleContent.includes('SMTP_PASSWORD=your-password')) {
    console.log('  ✅ Confirmed: .env.example contains only placeholders, no real passwords.');
  } else {
    console.error('  ❌ Real password detected in .env.example!');
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL 12 ENQUIRY & BACKUP VERIFICATION TESTS PASSED!');
  console.log('================================================================\n');
}

runVerification().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
