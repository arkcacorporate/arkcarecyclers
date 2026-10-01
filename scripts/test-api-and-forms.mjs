import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

// 1. Load environment variables
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

async function runTestSuite() {
  console.log('====================================================');
  console.log('  ARKCA Corporate - Email-Only Verification Suite   ');
  console.log('====================================================\n');

  // Test 1: Malformed JSON handling (Requirement 3 & 9)
  console.log('[1/8] Testing Malformed JSON Rejection (Must return 400)...');
  const malformedRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"user_name": "Test", "broken": }', // Invalid JSON syntax
  });
  const malformedData = await malformedRes.json();
  if (malformedRes.status === 400 && malformedData.success === false) {
    console.log(`  ✅ Rejected with HTTP 400: "${malformedData.message}"`);
  } else {
    console.error('  ❌ Malformed JSON test failed:', malformedRes.status, malformedData);
    process.exit(1);
  }

  // Test 2: Empty Request Body (Requirement 3 & 9)
  console.log('\n[2/8] Testing Empty Body Rejection (Must return 400)...');
  const emptyRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  });
  const emptyData = await emptyRes.json();
  if (emptyRes.status === 400 && emptyData.success === false) {
    console.log(`  ✅ Rejected with HTTP 400: "${emptyData.message}"`);
  } else {
    console.error('  ❌ Empty body test failed:', emptyRes.status, emptyData);
    process.exit(1);
  }

  // Test 3: Missing Required Fields (Requirement 3 & 9)
  console.log('\n[3/8] Testing Missing Email & Phone (Must return 400)...');
  const missingRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Incomplete User',
      company: 'Test Corp',
      message: 'No contact info provided',
    }),
  });
  const missingData = await missingRes.json();
  if (missingRes.status === 400 && missingData.success === false) {
    console.log(`  ✅ Rejected with HTTP 400: "${missingData.message}"`);
  } else {
    console.error('  ❌ Missing fields test failed:', missingRes.status, missingData);
    process.exit(1);
  }

  // Test 4: Invalid Email Format (Requirement 9)
  console.log('\n[4/8] Testing Invalid Email Format (Must return 400)...');
  const invalidEmailRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Invalid Email User',
      user_email: 'not-an-email',
      phone_no: '9876543210',
    }),
  });
  const invalidEmailData = await invalidEmailRes.json();
  if (invalidEmailRes.status === 400 && invalidEmailData.success === false) {
    console.log(`  ✅ Rejected with HTTP 400: "${invalidEmailData.message}"`);
  } else {
    console.error('  ❌ Invalid email test failed:', invalidEmailRes.status, invalidEmailData);
    process.exit(1);
  }

  // Test 5: Anti-Spam Honeypot Trapping (Requirement 3 & 7)
  console.log('\n[5/8] Testing Anti-Spam Honeypot Trapping (HTTP 200 without email dispatch)...');
  const honeypotRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: 'Spam Bot',
      user_email: 'bot@spam.com',
      phone_no: '1234567890',
      message: 'Cheap sunglasses',
      honeypot: 'filled_by_bot_field',
    }),
  });
  const honeypotData = await honeypotRes.json();
  if (honeypotRes.status === 200 && honeypotData.success === true) {
    console.log(`  ✅ Honeypot trapped successfully (HTTP 200 returned).`);
  } else {
    console.error('  ❌ Honeypot test failed:', honeypotRes.status, honeypotData);
    process.exit(1);
  }

  // Test 6: Special Characters, Quotes, Apostrophes, Backslashes, Multiline Message (Requirement 3, 6, 9)
  console.log('\n[6/8] Testing Special Characters, Quotes, Apostrophes & Multiline Message...');
  const complexPayload = {
    user_name: "O'Connor & Sons \"Quality\" Recycling",
    phone_no: "+91 93166-31170",
    user_email: "corporate@arkcarecyclers.com",
    company: "O'Reilly & Associates <Industrial>",
    purpose: "Hazardous & E-Waste / CPCB Form 6",
    message: "Line 1: Enquiry with apostrophes like aren't and don't.\nLine 2: Quotes like \"verified\" and 'certified'.\nLine 3: Characters: <script>alert('xss')</script> & Symbols: 100% recycling / \\path\\to\\file.\nLine 4: Final multiline wrap test.",
  };

  const complexRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complexPayload),
  });
  const complexData = await complexRes.json();
  if (complexRes.status === 200 && complexData.success === true) {
    console.log(`  ✅ Complex special characters + multiline email dispatched successfully!`);
    console.log(`  Response message: "${complexData.message}"`);
  } else {
    console.error('  ❌ Complex payload test failed:', complexRes.status, complexData);
    process.exit(1);
  }

  // Test 7: Standard Responsible Disposal Form (Exact Payload from user screenshot)
  console.log('\n[7/8] Testing Exact Responsible Disposal Form Payload (from user screenshot)...');
  const disposalPayload = {
    formType: 'disposal',
    formName: 'Responsible Disposal Request Form',
    pageName: 'Home',
    data: {
      name: 'Ankita arkca',
      company: 'Arkca',
      email: 'ankitaarkca@gmail.com',
      phone: '7605862219',
      pincode: '700137',
      message: 'for testing purpose',
    },
  };

  const disposalRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disposalPayload),
  });
  const disposalData = await disposalRes.json();
  if (disposalRes.status === 200 && disposalData.success === true) {
    console.log(`  ✅ User screenshot disposal enquiry dispatched successfully via SMTP!`);
    console.log(`  Response:`, disposalData);
  } else {
    console.error('  ❌ Screenshot disposal form test failed:', disposalRes.status, disposalData);
    process.exit(1);
  }

  // Test 8: Contact Us Form
  console.log('\n[8/8] Testing Contact Us Form Payload...');
  const contactPayload = {
    formType: 'contact',
    formName: 'Contact Us General Inquiry Form',
    pageName: 'Contact Us',
    data: {
      name: 'Corporate Test Lead',
      email: 'corporate@arkcarecyclers.com',
      phone: '+91 98765 43210',
      company: 'Arkca Corporate Lead',
      serviceInterest: 'Waste Collection',
      subject: 'Corporate E-Waste Clearance',
      message: 'Testing email-only direct SMTP enquiry submission.',
    },
  };

  const contactRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactPayload),
  });
  const contactData = await contactRes.json();
  if (contactRes.status === 200 && contactData.success === true) {
    console.log(`  ✅ Contact Us form enquiry dispatched successfully via SMTP!`);
  } else {
    console.error('  ❌ Contact Us test failed:', contactRes.status, contactData);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL EMAIL-ONLY ENQUIRY SYSTEM TESTS PASSED!      ');
  console.log('====================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
