/**
 * ARKCA Recyclers - Client-Side Enquiry Submission Bridge
 * 
 * Replaces previous client-side EmailJS with secure Next.js backend API (/api/enquiry).
 * Preserves the exact signature sendEmail(...) so all 5 existing forms work seamlessly
 * without requiring any UI, styling, markup, or component modifications.
 */

let lastSubmissionTime = 0;
const SUBMISSION_COOLDOWN_MS = 3000; // 3 seconds anti-rapid-double-click

/**
 * Dispatch Form Data to Server-Side Enquiry API
 * 
 * @param {Object} params
 * @param {string} params.formType - 'contact' | 'disposal' | 'pickup' | 'epr' | 'newsletter'
 * @param {string} params.formName - Human-readable form title
 * @param {string} params.pageName - Name of the originating page
 * @param {Object} params.data - Form field values
 * @param {string} [params.honeypot] - Anti-spam honeypot field
 * @returns {Promise<{ success: boolean, message?: string, error?: string, id?: string }>}
 */
export async function sendEmail({
  formType = 'contact',
  formName = '',
  pageName = '',
  data = {},
  honeypot = '',
}) {
  // 1. Anti-spam honeypot check (fast client bypass for bots)
  if (honeypot && String(honeypot).trim() !== '') {
    return { success: true, message: 'Message sent successfully.' };
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

  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType,
        formName,
        pageName,
        data,
        honeypot,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.message || 'Unable to submit enquiry. Please try again.',
      };
    }

    lastSubmissionTime = now;
    return {
      success: true,
      message: result.message || 'Enquiry submitted successfully.',
      id: result.id,
    };
  } catch (err) {
    console.error('Enquiry dispatch error:', err);
    return {
      success: false,
      error: 'Network connection issue. Please check your internet connection or email us directly at contact@arkcarecyclers.com.',
    };
  }
}
