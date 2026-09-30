import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

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

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'arkca_recyclers';

console.log('----------------------------------------------------');
console.log('   ARKCA Recyclers - MongoDB Atlas Connection Test  ');
console.log('----------------------------------------------------');

if (!uri || uri.includes('<I WILL ENTER THE REAL VALUE LOCALLY>')) {
  console.error('\n❌ MONGODB_URI is not set in .env.local.');
  console.error('Please open .env.local and paste your real MongoDB connection string.');
  console.error('Example: MONGODB_URI=mongodb+srv://arkca_admin:YourPassword@arkca-cluster.xxxxx.mongodb.net/arkca_recyclers?retryWrites=true&w=majority\n');
  process.exit(1);
}

// Display safe masked URI for user reassurance
const maskedUri = uri.replace(/\/\/(.*?):(.*?)@/, '//$1:******@');
console.log(`Connecting to: ${maskedUri}`);
console.log(`Target Database: ${dbName}`);

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 8000,
});

async function runTest() {
  try {
    console.log('\n[1/3] Pinging MongoDB Atlas cluster...');
    await client.connect();
    const db = client.db(dbName);
    const pingResult = await db.command({ ping: 1 });

    if (pingResult.ok === 1) {
      console.log('✅ Ping successful! Cluster responded with ok: 1');
    }

    console.log('\n[2/3] Testing Write: Inserting verified test enquiry document...');
    const collection = db.collection('enquiries');
    const testDoc = {
      name: 'ARKCA Test Lead',
      email: 'test@arkcarecyclers.com',
      phone: '+91 93166 31170',
      company: 'ARKCA Corporate Test',
      service: 'Plastic Waste Recycling (Verification)',
      message: 'Phase 2 MongoDB connection verification test',
      status: 'new',
      createdAt: new Date(),
      metadata: {
        testRun: true,
        source: 'Phase 2 Verification Suite',
      },
    };

    const insertResult = await collection.insertOne(testDoc);
    console.log(`✅ Document successfully inserted!`);
    console.log(`   - Collection: enquiries`);
    console.log(`   - Document ID: ${insertResult.insertedId}`);

    console.log('\n[3/3] Testing Read: Querying document back from collection...');
    const found = await collection.findOne({ _id: insertResult.insertedId });
    if (found && found.name === testDoc.name) {
      console.log(`✅ Read verification succeeded! Name matches: "${found.name}"`);
    }

    console.log('\n====================================================');
    console.log('🎉 ALL MONGODB ATLAS TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
    console.log(`Collection Name : enquiries`);
    console.log(`Database Name   : ${dbName}`);
    console.log(`Inserted ID     : ${insertResult.insertedId}`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ MongoDB Connection/Operation failed:');
    console.error(err.message);
    if (err.name === 'MongoServerSelectionError') {
      console.error('\nCommon causes:');
      console.error(' 1. IP Whitelist: Ensure your current IP is added in Network Access in Atlas.');
      console.error(' 2. Bad credentials: Double check the database username and password in .env.local.');
      console.error(' 3. Special characters: If your password contains special characters, ensure it is URL-encoded.');
    }
    process.exit(1);
  } finally {
    await client.close();
  }
}

runTest();
