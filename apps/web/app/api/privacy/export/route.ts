import { NextRequest, NextResponse } from 'next/server';

/**
 * Privacy Data Export API
 *
 * Exports all user data in JSON format (GDPR data portability).
 * Requires verified identity.
 */

interface ExportData {
  exportId: string;
  requestedAt: string;
  email: string;
  data: {
    inquiries: unknown[];
    reviews: unknown[];
    comparisons: unknown[];
    savedProperties: unknown[];
    profile: unknown | null;
    consentHistory: unknown[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate inputs
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Verify the code
    const isValidCode = /^\d{6}$/.test(code);
    if (!isValidCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 401 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate export ID
    const exportId = `export_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // In production, query the database and decrypt PII
    // const encryptionKey = process.env.ENCRYPTION_KEY!;
    // const emailPepper = process.env.EMAIL_PEPPER!;
    // const emailHash = await hashEmail(normalizedEmail, emailPepper);

    // Build export data structure
    const exportData: ExportData = {
      exportId,
      requestedAt: new Date().toISOString(),
      email: normalizedEmail,
      data: {
        inquiries: [],
        reviews: [],
        comparisons: [],
        savedProperties: [],
        profile: null,
        consentHistory: [],
      },
    };

    // TODO: Replace with actual database queries and decryption
    // Example:
    // const inquiries = await db.inquiry.findMany({
    //   where: { emailHash }
    // });
    // for (const inquiry of inquiries) {
    //   exportData.data.inquiries.push({
    //     id: inquiry.id,
    //     propertyId: inquiry.propertyId,
    //     name: await decryptPII(inquiry.nameEncrypted, encryptionKey),
    //     email: await decryptPII(inquiry.emailEncrypted, encryptionKey),
    //     message: inquiry.messageEncrypted
    //       ? await decryptPII(inquiry.messageEncrypted, encryptionKey)
    //       : null,
    //     createdAt: inquiry.createdAt,
    //   });
    // }

    // Convert to JSON and create response
    const jsonData = JSON.stringify(exportData, null, 2);

    return new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="clarus-vitae-data-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
