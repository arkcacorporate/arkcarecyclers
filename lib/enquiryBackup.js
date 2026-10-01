import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'data');
const backupFilePath = path.join(dataDir, 'enquiries.json');

// In-memory sequential queue to serialize concurrent writes and prevent race conditions
let writeQueue = Promise.resolve();

function withLock(fn) {
  const result = writeQueue.then(() => fn(), () => fn());
  writeQueue = result.catch(() => {});
  return result;
}

/**
 * Format timestamp in IST (+05:30)
 */
function getIstDateParts() {
  const d = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(d.getTime() + istOffset);
  const pad = (n) => String(n).padStart(2, '0');
  const Y = istDate.getUTCFullYear();
  const M = pad(istDate.getUTCMonth() + 1);
  const D = pad(istDate.getUTCDate());
  const h = pad(istDate.getUTCHours());
  const m = pad(istDate.getUTCMinutes());
  const s = pad(istDate.getUTCSeconds());
  return {
    dateKey: `${Y}${M}${D}`,
    submittedAt: `${Y}-${M}-${D}T${h}:${m}:${s}+05:30`,
  };
}

/**
 * Append a validated enquiry record to data/enquiries.json
 * 
 * @param {Object} payload - Validated enquiry attributes
 * @returns {Promise<Object>} The persisted record including generated id and submitted_at
 */
export async function appendEnquiryBackup({
  user_name = '',
  phone_no = '',
  user_email = '',
  company = '',
  purpose = '',
  message = '',
  allFields = {},
}) {
  return withLock(async () => {
    // 1. Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 2. Read existing records safely
    let records = [];
    if (fs.existsSync(backupFilePath)) {
      try {
        const content = fs.readFileSync(backupFilePath, 'utf8');
        if (content.trim()) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            records = parsed;
          }
        }
      } catch (readErr) {
        console.error('[enquiryBackup] Error reading existing JSON backup:', readErr);
        // Preserve unparseable file before re-initializing
        const recoveryPath = path.join(dataDir, `enquiries.corrupt.${Date.now()}.json`);
        fs.copyFileSync(backupFilePath, recoveryPath);
        records = [];
      }
    }

    // 3. Generate unique enquiry ID (e.g. ENQ-20261001-001)
    const { dateKey, submittedAt } = getIstDateParts();
    const existingIds = new Set(records.map((r) => r.id));
    let counter = records.filter((r) => r && typeof r.id === 'string' && r.id.startsWith(`ENQ-${dateKey}-`)).length + 1;
    let candidateId = `ENQ-${dateKey}-${String(counter).padStart(3, '0')}`;
    while (existingIds.has(candidateId)) {
      counter++;
      candidateId = `ENQ-${dateKey}-${String(counter).padStart(3, '0')}`;
    }

    // 4. Construct clean enquiry record
    // Exclude internal/spam/sensitive fields
    const excludedKeys = new Set([
      'honeypot', 'formType', 'formName', 'pageName', 'data',
      'password', 'smtp_password', 'smtp_pass', 'token', 'secret'
    ]);

    const additionalDetails = {};
    const standardCoreKeys = new Set([
      'id', 'user_name', 'phone_no', 'user_email', 'company', 'purpose', 'message', 'submitted_at'
    ]);

    // Preserve any existing extra fields (e.g., waste_sub_category, weight, date, pincode, city, etc.)
    for (const [k, v] of Object.entries(allFields)) {
      const lowerKey = k.toLowerCase();
      if (!excludedKeys.has(lowerKey) && !standardCoreKeys.has(k) && v !== undefined && v !== null && String(v).trim() !== '') {
        // Also map camelCase to snake_case if helpful (e.g. wasteSubCategory -> waste_sub_category)
        if (k === 'wasteSubCategory') {
          additionalDetails['waste_sub_category'] = String(v).trim();
        } else if (k === 'wasteCategory') {
          additionalDetails['waste_category'] = String(v).trim();
        } else {
          additionalDetails[k] = String(v).trim();
        }
      }
    }

    const newRecord = {
      id: candidateId,
      user_name: user_name || 'Not provided',
      phone_no: phone_no || 'Not provided',
      user_email: user_email || 'Not provided',
      company: company || 'Not provided',
      purpose: purpose || 'General Enquiry',
      ...additionalDetails,
      message: message || '',
      submitted_at: submittedAt,
    };

    // 5. Append new record
    records.push(newRecord);

    // 6. Write atomically using a temporary file to prevent partial writes
    const tempFile = path.join(dataDir, `enquiries.tmp.${process.pid}.${Date.now()}.json`);
    fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), 'utf8');
    fs.renameSync(tempFile, backupFilePath);

    return newRecord;
  });
}

/**
 * Helper to retrieve all backup records (server-side only, for testing/verification)
 */
export async function getBackupRecords() {
  return withLock(async () => {
    if (!fs.existsSync(backupFilePath)) {
      return [];
    }
    try {
      const content = fs.readFileSync(backupFilePath, 'utf8');
      if (!content.trim()) return [];
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
}
