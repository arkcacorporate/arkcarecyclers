import { NextResponse } from 'next/server';
import { createEnquiry, validateEnquiry, buildEnquiryDocument } from '@/lib/models/enquiry';
import { sendEnquiryNotification } from '@/lib/serverEmail';

/**
 * ARKCA Recyclers - Server-Side Enquiry API Route
 * 
 * Handles enquiry submissions from all 5 website forms:
 * 1. Contact Us
 * 2. Responsible Disposal Request (Home)
 * 3. Pickup Booking (Waste Collection)
 * 4. EPR Advisory Consultation
 * 5. Newsletter Subscription
 * 
 * Flow:
 * Client Form -> POST /api/enquiry -> Anti-Spam Check -> MongoDB Atlas -> Email Notification -> JSON Response
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { formType = 'contact', formName = '', pageName = '', data = {}, honeypot = '' } = body;

    // 1. Anti-spam: Honeypot check (bots fill hidden honeypot fields)
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn('[API /api/enquiry] Spam detected and blocked via honeypot.');
      return NextResponse.json({
        success: true,
        message: 'Enquiry submitted successfully',
      });
    }

    // 2. Normalize and validate payload
    const rawEnquiry = {
      ...data,
      formType,
      formName,
      pageName,
    };

    const doc = buildEnquiryDocument(rawEnquiry);
    const validation = validateEnquiry(doc);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.errors[0] || 'Invalid form submission.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 3. Save to MongoDB Atlas (Single source of truth)
    let savedResult;
    try {
      savedResult = await createEnquiry(rawEnquiry);
    } catch (dbErr) {
      console.error('[API /api/enquiry] MongoDB insertion failure:', dbErr);
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to submit enquiry at this moment. Please try again.',
        },
        { status: 500 }
      );
    }

    // 4. Trigger Email Notification (Fail-safe: failure never deletes or invalidates the saved enquiry)
    try {
      const emailResult = await sendEnquiryNotification({
        ...savedResult.document,
        _id: savedResult.insertedId,
      });

      if (!emailResult.success) {
        console.warn(
          `[API /api/enquiry] Notice: Enquiry ${savedResult.insertedId} saved to database, but notification email was not dispatched. Reason: ${emailResult.reason || 'unknown'}`
        );
      }
    } catch (emailErr) {
      // Log for server-side debugging without breaking customer success experience
      console.error('[API /api/enquiry] Background email notification exception:', emailErr);
    }

    // 5. Clean success response
    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry submitted successfully',
        id: savedResult.insertedId,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[API /api/enquiry] Unhandled request error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred while processing your request.',
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
    service: 'ARKCA Enquiry API',
    endpoint: '/api/enquiry',
  });
}
