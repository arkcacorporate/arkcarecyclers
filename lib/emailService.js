import emailjs from '@emailjs/browser';

/**
 * ARKCA Recyclers - EmailJS Integration Service
 * 
 * Secure frontend email dispatching configured for Next.js Static Export.
 * All recipient addresses (contact@arkcarecyclers.com, certificate@arkcacorporate.com, ankitaarkca@gmail.com)
 * are configured directly in the EmailJS dashboard template (To / CC / BCC) for security.
 */

// EmailJS Configuration from Environment Variables
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  defaultTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  // Optional form-specific template overrides
  templates: {
    contact: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    disposal: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_DISPOSAL || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    pickup: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_PICKUP || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    epr: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_EPR || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    newsletter: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_NEWSLETTER || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  }
};

// Fixed recipients info for logging and template documentation
export const FIXED_RECIPIENTS = [
  'contact@arkcarecyclers.com',
  'certificate@arkcacorporate.com',
  'ankitaarkca@gmail.com'
];

// Anti-spam cooldown tracker (timestamp of last submission)
let lastSubmissionTime = 0;
const SUBMISSION_COOLDOWN_MS = 6000; // 6 seconds between submissions

/**
 * Send Form Data via EmailJS
 * 
 * @param {Object} params
 * @param {string} params.formType - 'contact' | 'disposal' | 'pickup' | 'epr' | 'newsletter'
 * @param {string} params.formName - Human readable form name
 * @param {string} params.pageName - Name of the page originating the submission
 * @param {Object} params.data - The form values
 * @param {string} [params.honeypot] - Anti-spam honeypot field (must be empty)
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function sendEmail({ formType = 'contact', formName = '', pageName = '', data = {}, honeypot = '' }) {
  // 1. Anti-spam: Honeypot check (bots fill hidden fields)
  if (honeypot && honeypot.trim() !== '') {
    console.warn('Spam submission detected and blocked via honeypot.');
    // Return simulated success to trick bots without consuming EmailJS quota
    return { success: true, message: 'Message sent successfully.' };
  }

  // 2. Anti-spam: Rate limiting cooldown
  const now = Date.now();
  if (now - lastSubmissionTime < SUBMISSION_COOLDOWN_MS) {
    const waitSec = Math.ceil((SUBMISSION_COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
    return {
      success: false,
      error: `Please wait ${waitSec} second(s) before submitting another request.`
    };
  }

  const { serviceId, publicKey, templates, defaultTemplateId } = EMAILJS_CONFIG;
  const templateId = templates[formType] || defaultTemplateId;

  // 3. Validation of configuration
  if (!serviceId || !publicKey || !templateId) {
    console.warn(
      'EmailJS credentials are not configured. Please set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in .env.local.'
    );
    // In local development without env vars, provide a friendly explanation
    if (process.env.NODE_ENV === 'development') {
      console.info('Simulating email submission in development. Payload:', { formType, formName, pageName, data });
      lastSubmissionTime = now;
      return {
        success: true,
        message: 'Request simulated successfully (Add EmailJS keys in .env.local for live dispatch).'
      };
    }
    return {
      success: false,
      error: 'Email service is currently being configured. Please contact us directly at contact@arkcarecyclers.com.'
    };
  }

  // 4. Build comprehensive template variables
  // Generates both individualized variables and a clean formatted summary table/block
  const formattedDate = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const formattedSummary = Object.entries(data)
    .filter(([key]) => key !== 'honeypot')
    .map(([key, val]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      return `${label}: ${val || 'N/A'}`;
    })
    .join('\n');

  const templateParams = {
    // Meta / Routing fields
    page_name: pageName,
    form_name: formName,
    submission_date: formattedDate,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    fixed_recipients: FIXED_RECIPIENTS.join(', '),
    
    // Summary of all submitted details (ideal for universal EmailJS templates)
    message_summary: formattedSummary,
    summary: formattedSummary,

    // Specific field mappings matching standard EmailJS variable conventions
    name: data.name || data.contactPerson || data.contactName || 'Valued Client',
    email: data.email || '',
    phone: data.phone || '',
    company: data.company || data.companyName || data.businessName || 'N/A',
    subject: data.subject || `${formName} - ${data.name || data.company || 'New Inquiry'}`,
    message: data.message || data.notes || data.specialNotes || 'No additional notes provided.',

    // Pass through all original data fields for custom template access
    ...data
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      { publicKey }
    );

    if (response.status === 200 || response.text === 'OK') {
      lastSubmissionTime = now;
      return { success: true, message: 'Message sent successfully.' };
    } else {
      throw new Error(`EmailJS responded with status: ${response.status} ${response.text}`);
    }
  } catch (err) {
    console.error('EmailJS submission error:', err);
    return {
      success: false,
      error: 'Unable to send message at this moment. Please verify your internet connection or email us at contact@arkcarecyclers.com.'
    };
  }
}
