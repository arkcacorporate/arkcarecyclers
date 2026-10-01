/**
 * ARKCA Corporate - Client-Side Enquiry Submission Bridge
 * 
 * Dispatches form data directly to the server-side /api/enquiry route.
 * Preserves the exact signature sendEmail(...) so all 5 existing forms work seamlessly
 * without requiring any UI, styling, markup, or component modifications.
 */

let lastSubmissionTime = 0;
const SUBMISSION_COOLDOWN_MS = 2500; // 2.5 seconds anti-double-click cooldown

/**
 * Dispatch Form Data to Server-Side Enquiry API
 * 
 * @param {Object} params
 * @param {string} [params.formType]
 * @param {string} [params.formName]
 * @param {string} [params.pageName]
 * @param {Object} [params.data]
 * @param {string} [params.honeypot]
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function sendEmail({
  formType = 'contact',
  formName = '',
  pageName = '',
  data = {},
  honeypot = '',
}) {
  // 1. Anti-spam honeypot quick bypass for bots
  if (honeypot && String(honeypot).trim() !== '') {
    return { success: true, message: 'Enquiry submitted successfully.' };
  }

  // 2. Anti-double-submit cooldown
  const now = Date.now();
  if (now - lastSubmissionTime < SUBMISSION_COOLDOWN_MS) {
    const waitSec = Math.ceil((SUBMISSION_COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
    return {
      success: false,
      error: `Please wait ${waitSec} second(s) before submitting again.`,
    };
  }

  // 3. Prepare standardized payload
  // Maps standard fields (user_name, phone_no, user_email, company, purpose, message)
  // as well as preserving existing form metadata.
  const payload = {
    user_name: data.user_name || data.name || data.contactPerson || data.contactName || '',
    phone_no: data.phone_no || data.phone || '',
    user_email: data.user_email || data.email || '',
    company: data.company || data.companyName || data.businessName || '',
    purpose: data.purpose || data.serviceInterest || data.service || data.wasteCategory || data.wasteType || data.wasteStream || data.subject || formName || formType || 'General Enquiry',
    message: data.message || data.notes || data.specialNotes || '',
    formType,
    formName,
    pageName,
    data,
    honeypot,
  };

  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      return {
        success: false,
        error: 'Unable to submit enquiry at this moment. Please try again.',
      };
    }

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.message || 'Unable to submit enquiry at this moment. Please try again.',
      };
    }

    lastSubmissionTime = now;
    return {
      success: true,
      message: result.message || 'Enquiry submitted successfully.',
    };
  } catch (err) {
    console.error('[emailService] Network/dispatch error:', err);
    return {
      success: false,
      error: 'Network connection issue. Please check your internet connection or email us directly at contact@arkcarecyclers.com.',
    };
  }
}
