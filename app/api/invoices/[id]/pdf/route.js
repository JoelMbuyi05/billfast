// app/api/invoices/[id]/pdf/route.js
import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import PDFInvoice from '@/components/pdf/PDFInvoice';

// Firebase Admin v12 - CommonJS style works better with Next.js
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export async function GET(request, { params }) {
  try {
    const invoiceId = params.id;

    // Fetch invoice
    const invoiceDoc = await db.collection('invoices').doc(invoiceId).get();
    
    if (!invoiceDoc.exists) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = { id: invoiceDoc.id, ...invoiceDoc.data() };

    // Handle Timestamp objects
    if (invoice.createdAt) {
      invoice.createdAt = invoice.createdAt.toDate().toISOString();
    }
    if (invoice.issueDate) {
      invoice.issueDate = invoice.issueDate.toDate().toISOString();
    }
    if (invoice.dueDate) {
      invoice.dueDate = invoice.dueDate.toDate().toISOString();
    }

    // Fetch business info
    const userDoc = await db.collection('users').doc(invoice.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const businessInfo = userDoc.data();

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      PDFInvoice({
        invoice,
        businessInfo,
      })
    );

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber || invoiceId}.pdf"`
      }
    });

  } catch (error) {
    console.error('PDF generation error:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}