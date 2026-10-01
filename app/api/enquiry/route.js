import { NextResponse } from 'next/server';
import { sendEnquiryEmail } from '@/lib/serverEmail';
import { appendEnquiryBackup } from '@/lib/enquiryBackup';

/**
 * ARKCA Corporate - Server-Side Enquiry API Route
 * 
 * Flow:
 * Client Form -> POST /api/enquiry -> Validate JSON -> Honeypot Check -> Validate Fields -> Create JSON Backup -> Send SMTP Email -> Success Response
 * 
 * Database-free with local JSON audit backup in data/enquiries.json.
 */

export async function POST(request) {
  // 1. Safely parse JSON with robust error handling for malformed payloads
  let body;
  try {
    const rawText = await request.text();
    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Request body cannot be empty.',
        },
        { status: 400 }
      );
    }
    body = JSON.parse(rawText);
  } catch (jsonErr) {
    console.error('[API /api/enquiry] JSON SyntaxError:', jsonErr.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Malformed JSON payload. Please provide valid JSON.',
      },
      { status: 400 }
    );
  }

  try {
    // 2. Anti-spam Honeypot Check (Do not store, do not send email)
    const honeypot = body.honeypot || (body.data && body.data.honeypot) || '';
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn('[API /api/enquiry] Bot submission intercepted via honeypot.');
      return NextResponse.json(
        {
          success: true,
          message: 'Enquiry submitted successfully.',
        },
        { status: 200 }
      );
    }

    // 3. Extract & Normalize Form Fields
    // Seamlessly supports both flat payloads ({ user_name, phone_no, ... }) and nested payloads ({ data: { ... } })
    const data = (body.data && typeof body.data === 'object') ? body.data : {};

    const user_name = (
      body.user_name ||
      data.user_name ||
      data.name ||
      body.name ||
      data.contactPerson ||
      data.contactName ||
      ''
    ).toString().trim();

    const phone_no = (
      body.phone_no ||
      data.phone_no ||
      data.phone ||
      body.phone ||
      ''
    ).toString().trim();

    const user_email = (
      body.user_email ||
      data.user_email ||
      data.email ||
      body.email ||
      ''
    ).toString().trim().toLowerCase();

    const company = (
      body.company ||
      data.company ||
      data.companyName ||
      data.businessName ||
      body.companyName ||
      ''
    ).toString().trim();

    const purpose = (
      body.purpose ||
      data.purpose ||
      data.serviceInterest ||
      data.service ||
      data.wasteCategory ||
      data.wasteType ||
      data.wasteStream ||
      data.subject ||
      body.formName ||
      data.formName ||
      body.formType ||
      'General Enquiry'
    ).toString().trim();

    const message = (
      body.message ||
      data.message ||
      data.notes ||
      data.specialNotes ||
      ''
    ).toString().trim();

    // 4. Validate Required Form Fields
    if (!user_email && !phone_no) {
      return NextResponse.json(
        {
          success: false,
          message: 'At least an email address or phone number is required.',
        },
        { status: 400 }
      );
    }

    if (user_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user_email)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Please enter a valid email address.',
          },
          { status: 400 }
        );
      }
    }

    // Capture extra fields for both JSON backup and email table
    const extraFields = {};
    const standardKeys = new Set([
      'user_name', 'name', 'contactPerson', 'contactName',
      'phone_no', 'phone',
      'user_email', 'email',
      'company', 'companyName', 'businessName',
      'purpose', 'serviceInterest', 'service', 'wasteCategory', 'wasteType', 'wasteStream', 'subject',
      'message', 'notes', 'specialNotes',
      'honeypot', 'formType', 'formName', 'pageName', 'data'
    ]);

    for (const [key, val] of Object.entries({ ...data, ...body })) {
      if (!standardKeys.has(key) && val !== undefined && val !== null && String(val).trim() !== '') {
        extraFields[key] = String(val).trim();
      }
    }

    // 5. Create Server-Side JSON Backup (data/enquiries.json)
    let backupRecord;
    try {
      backupRecord = await appendEnquiryBackup({
        user_name,
        phone_no,
        user_email,
        company,
        purpose,
        message,
        allFields: { ...data, ...body },
      });
    } catch (backupErr) {
      console.error('[API /api/enquiry] JSON Backup Failure:', backupErr);
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to submit enquiry at this moment. Please try again.',
        },
        { status: 500 }
      );
    }

    // 6. Send Professional HTML Email via SMTP
    try {
      const emailResult = await sendEnquiryEmail({
        user_name,
        phone_no,
        user_email,
        company,
        purpose,
        message,
        extraFields,
        formName: body.formName || data.formName || 'Website Enquiry',
        pageName: body.pageName || data.pageName || 'Website',
        enquiryId: backupRecord.id,
      });

      if (!emailResult.success) {
        console.error('[API /api/enquiry] SMTP Delivery Failed:', emailResult.error);
        // Note: The JSON backup record in data/enquiries.json is preserved
        return NextResponse.json(
          {
            success: false,
            message: 'Unable to submit enquiry at this moment. Please try again.',
          },
          { status: 500 }
        );
      }
    } catch (smtpErr) {
      console.error('[API /api/enquiry] SMTP Send Exception:', smtpErr);
      // Note: The JSON backup record in data/enquiries.json is preserved
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to submit enquiry at this moment. Please try again.',
        },
        { status: 500 }
      );
    }

    // 7. Return Success Response Only After Confirmed SMTP Dispatch
    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry submitted successfully.',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[API /api/enquiry] Unhandled Request Processing Error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit enquiry at this moment. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'ARKCA Corporate Enquiry API (Email Only with JSON Backup)',
    endpoint: '/api/enquiry',
  });
}
