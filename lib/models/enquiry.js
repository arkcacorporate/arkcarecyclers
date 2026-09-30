import { getDb } from '@/lib/mongodb';

/**
 * Enquiry Data Model & Helper Functions
 * 
 * Collection: 'enquiries'
 * 
 * Target Schema:
 * {
 *   name: string,
 *   email: string,
 *   phone: string,
 *   company: string,
 *   service: string,
 *   message: string,
 *   status: 'new' | 'in_progress' | 'contacted' | 'resolved' | 'archived',
 *   createdAt: Date,
 *   metadata?: object (preserves form-specific extra details)
 * }
 */

export const ENQUIRIES_COLLECTION = 'enquiries';

export const ENQUIRY_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  CONTACTED: 'contacted',
  RESOLVED: 'resolved',
  ARCHIVED: 'archived',
};

/**
 * Normalize and construct a clean Enquiry document
 * @param {Object} rawInput
 * @returns {Object} Cleaned enquiry document
 */
export function buildEnquiryDocument(rawInput = {}) {
  const {
    name,
    contactPerson,
    contactName,
    email,
    phone,
    company,
    businessName,
    companyName,
    service,
    serviceInterest,
    wasteType,
    wasteCategory,
    formType,
    message,
    specialNotes,
    notes,
    status,
    createdAt,
    ...extraFields
  } = rawInput;

  // Resolve normalized values from various form naming conventions
  const resolvedName = (name || contactPerson || contactName || '').toString().trim();
  const resolvedEmail = (email || '').toString().trim().toLowerCase();
  const resolvedPhone = (phone || '').toString().trim();
  const resolvedCompany = (company || businessName || companyName || '').toString().trim();
  const resolvedService = (
    service ||
    serviceInterest ||
    wasteType ||
    wasteCategory ||
    (formType ? `${formType.toUpperCase()} Enquiry` : 'General Enquiry')
  ).toString().trim();
  const resolvedMessage = (message || specialNotes || notes || '').toString().trim();

  // Clean out internal/spam fields from extra metadata
  delete extraFields.honeypot;

  return {
    formType: formType || 'general',
    formName: rawInput.formName || 'General Enquiry',
    pageName: rawInput.pageName || 'Website',
    name: resolvedName,
    email: resolvedEmail,
    phone: resolvedPhone,
    company: resolvedCompany,
    service: resolvedService,
    message: resolvedMessage,
    status: status || ENQUIRY_STATUS.NEW,
    createdAt: createdAt ? new Date(createdAt) : new Date(),
    metadata: Object.keys(extraFields).length > 0 ? extraFields : undefined,
  };
}

/**
 * Validate enquiry payload
 * @param {Object} doc
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateEnquiry(doc) {
  const errors = [];

  if (!doc.email && !doc.phone) {
    errors.push('At least an email address or phone number is required.');
  }

  if (doc.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(doc.email)) {
      errors.push('Please enter a valid email address.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Insert an enquiry document into MongoDB Atlas
 * @param {Object} rawData
 * @returns {Promise<{ acknowledged: boolean, insertedId: string, document: Object }>}
 */
export async function createEnquiry(rawData) {
  const doc = buildEnquiryDocument(rawData);
  const validation = validateEnquiry(doc);

  if (!validation.valid) {
    const err = new Error(validation.errors.join(' '));
    err.statusCode = 400;
    err.details = validation.errors;
    throw err;
  }

  const db = await getDb();
  const collection = db.collection(ENQUIRIES_COLLECTION);
  const result = await collection.insertOne(doc);

  return {
    acknowledged: result.acknowledged,
    insertedId: result.insertedId.toString(),
    document: doc,
  };
}
