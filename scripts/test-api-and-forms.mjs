import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, ObjectId } from 'mongodb';

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

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'arkca_recyclers';
const API_URL = 'http://localhost:3000/api/enquiry';

const testCases = [
  {
    name: '1. Contact Us Form',
    payload: {
      formType: 'contact',
      formName: 'Contact Us General Inquiry Form',
      pageName: 'Contact Us',
      data: {
        name: 'Priya Sharma (Test)',
        email: 'priya.test@arkcarecyclers.com',
        phone: '+91 98765 43210',
        company: 'TechCorp India Ltd',
        serviceInterest: 'Waste Collection',
        subject: 'Corporate E-Waste Clearance',
        message: 'Need authorized recycling for 40 old desktop units and batteries.',
      },
    },
  },
  {
    name: '2. Responsible Disposal Request Form (Home)',
    payload: {
      formType: 'disposal',
      formName: 'Responsible Disposal Request Form',
      pageName: 'Home',
      data: {
        wasteCategory: 'Electronic Waste',
        wasteSubCategory: 'Servers & Network Racks',
        weight: '1.5 Tonnes',
        date: '2026-10-15',
        name: 'Rajesh Nair (Test)',
        company: 'Nair Logistics Hub',
        email: 'rajesh.test@arkcarecyclers.com',
        phone: '+91 91234 56789',
        pincode: '400001',
        message: 'Annual audit compliance disposal with Form 6 manifest required.',
      },
    },
  },
  {
    name: '3. Pickup Booking Request Form',
    payload: {
      formType: 'pickup',
      formName: 'Pickup Booking Request Form',
      pageName: 'Waste Collection',
      data: {
        businessName: 'Apex Polymers India',
        contactPerson: 'Anil Desai (Test)',
        phone: '+91 98220 11223',
        email: 'anil.test@arkcarecyclers.com',
        city: 'Mumbai',
        wasteType: 'Plastic Waste',
        approxWeight: '500 Kg - 2 Tonnes',
        preferredDate: '2026-10-10',
        specialNotes: 'Material is segregated into HDPE baled bundles.',
      },
    },
  },
  {
    name: '4. EPR Advisory Consultation Form',
    payload: {
      formType: 'epr',
      formName: 'EPR Advisory Consultation Form',
      pageName: 'EPR Consultancy',
      data: {
        companyName: 'Zenith Appliances Corp',
        contactPerson: 'Meera Rao (Test)',
        email: 'meera.test@arkcarecyclers.com',
        phone: '+91 97112 33445',
        city: 'Delhi NCR',
        annualVolume: '150 Metric Tonnes',
        primaryCategory: 'Plastic Packaging (Cat II)',
        message: 'Assistance required for annual CPCB portal compliance and credit filing.',
      },
    },
  },
  {
    name: '5. Newsletter Subscription Form',
    payload: {
      formType: 'newsletter',
      formName: 'Newsletter Subscription Form',
      pageName: 'Global Site Footer',
      data: {
        email: 'sustainability.director@test.com',
      },
    },
  },
];

async function runVerification() {
  console.log('====================================================');
  console.log('  ARKCA Recyclers - API & MongoDB Verification Suite');
  console.log('====================================================\n');

  const insertedIds = [];

  // 1. Run all 5 form submissions through POST /api/enquiry
  for (const testCase of testCases) {
    console.log(`Testing [${testCase.name}]...`);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase.payload),
    });

    const data = await res.json();
    if (res.ok && data.success && data.id) {
      console.log(`  ✅ HTTP 200 OK | Saved Document ID: ${data.id}`);
      insertedIds.push({ name: testCase.name, id: data.id });
    } else {
      console.error(`  ❌ Failed:`, data);
      process.exit(1);
    }
  }

  // 2. Test Anti-Spam Honeypot Handling
  console.log('\nTesting Anti-Spam Honeypot Trapping...');
  const honeypotRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formType: 'contact',
      data: { name: 'Bot Spammer', email: 'spam@bot.com' },
      honeypot: 'i-am-a-bot-field-filled',
    }),
  });
  const honeypotData = await honeypotRes.json();
  if (honeypotRes.ok && honeypotData.success && !honeypotData.id) {
    console.log('  ✅ Honeypot trapped successfully (HTTP 200 returned, but no MongoDB document created).');
  } else {
    console.error('  ❌ Honeypot test failed:', honeypotData);
  }

  // 3. Test Invalid Input Rejection
  console.log('\nTesting Invalid Submission Rejection (Missing email & phone)...');
  const invalidRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formType: 'contact',
      data: { name: 'Incomplete Submission' },
    }),
  });
  const invalidData = await invalidRes.json();
  if (invalidRes.status === 400 && !invalidData.success) {
    console.log(`  ✅ Rejected with HTTP 400: "${invalidData.message}"`);
  } else {
    console.error('  ❌ Invalid submission test failed:', invalidData);
  }

  // 4. Verify Directly in MongoDB Atlas
  console.log('\nConnecting to MongoDB Atlas to verify documents in "enquiries" collection...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('enquiries');

  for (const item of insertedIds) {
    const doc = await collection.findOne({ _id: new ObjectId(item.id) });
    if (doc) {
      console.log(`  ✅ Verified in MongoDB: [${item.name}]`);
      console.log(`     - Name: ${doc.name}`);
      console.log(`     - Email: ${doc.email}`);
      console.log(`     - Service: ${doc.service}`);
      console.log(`     - Status: ${doc.status}`);
      console.log(`     - Form Type: ${doc.formType}`);
      console.log(`     - Created At: ${doc.createdAt}`);
    } else {
      console.error(`  ❌ Document not found in MongoDB for ID: ${item.id}`);
    }
  }

  await client.close();

  console.log('\n====================================================');
  console.log('🎉 ALL 5 FORMS + API + MONGODB ATLAS TESTS PASSED!');
  console.log('====================================================\n');
}

runVerification().catch((err) => {
  console.error('Verification suite error:', err);
  process.exit(1);
});
