import { MongoClient } from 'mongodb';

/**
 * MongoDB Atlas Connection Utility for Next.js App Router
 * 
 * Implements connection caching across hot-reloads in development
 * and single-instance connection reuse in serverless/Node environments.
 * Strictly server-side: Never exposed to the browser.
 */

const uri = process.env.MONGODB_URI;
const defaultDbName = process.env.MONGODB_DB || 'arkca_recyclers';

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

function getClientPromise() {
  const currentUri = process.env.MONGODB_URI;

  if (!currentUri || currentUri.includes('<I WILL ENTER THE REAL VALUE LOCALLY>')) {
    throw new Error(
      'MONGODB_URI is not properly configured. Please set a valid MongoDB Atlas connection string in .env.local.'
    );
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the MongoClient across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(currentUri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable
    if (!clientPromise) {
      client = new MongoClient(currentUri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Get MongoDB Database instance
 * @param {string} [dbName]
 * @returns {Promise<import('mongodb').Db>}
 */
export async function getDb(dbName = defaultDbName) {
  const connectedClient = await getClientPromise();
  return connectedClient.db(dbName);
}

/**
 * Ping the database to verify live connection
 * @returns {Promise<{ ok: boolean, message: string, dbName: string }>}
 */
export async function pingDatabase() {
  const db = await getDb();
  await db.command({ ping: 1 });
  return {
    ok: true,
    message: 'Successfully connected and pinged MongoDB Atlas.',
    dbName: db.databaseName,
  };
}

export default getClientPromise;
