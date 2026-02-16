// app/invoice/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

export default function PublicInvoicePage() {
  const params = useParams();
  const invoiceId = params.id;
  
  const [invoice, setInvoice] = useState(null);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        // Fetch invoice
        const invoiceDoc = await getDoc(doc(db, 'invoices', invoiceId));
        
        if (!invoiceDoc.exists()) {
          alert('Invoice not found');
          return;
        }

        const invoiceData = invoiceDoc.data();
        setInvoice(invoiceData);

        // Fetch business info
        const userDoc = await getDoc(doc(db, 'users', invoiceData.userId));
        setBusinessInfo(userDoc.data());

        // Track view (only if status is "sent", not "viewed" yet)
        if (invoiceData.status === 'sent') {
          await updateDoc(doc(db, 'invoices', invoiceId), {
            status: 'viewed',
            viewedAt: new Date().toISOString(),
            viewCount: increment(1)
          });
        } else {
          // Just increment view count
          await updateDoc(doc(db, 'invoices', invoiceId), {
            viewCount: increment(1)
          });
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        alert('Error loading invoice');
      } finally {
        setLoading(false);
      }
    }

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  async function handleDownload() {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading PDF');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice || !businessInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invoice not found</h1>
          <p className="text-gray-600">This invoice may have been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600">
              From {businessInfo.businessName}
            </p>
          </div>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Invoice Preview (same as InvoicePreview component) */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8 md:p-12">
            
            {/* Header - Business Info */}
            <div className="flex items-start justify-between mb-8">
            <div>
                {businessInfo.logoUrl && (
                <div className="relative h-16 w-32 mb-4">
                    <Image
                    src={businessInfo.logoUrl}
                    alt={`${businessInfo.businessName} logo`}
                    fill
                    sizes="128px"
                    className="object-contain object-left"
                    priority={false}
                    />
                </div>
                )}
                <h2 className="text-xl font-bold">
                {businessInfo.businessName}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                {businessInfo.businessEmail && <p>{businessInfo.businessEmail}</p>}
                {businessInfo.businessPhone && <p>{businessInfo.businessPhone}</p>}
                {businessInfo.businessAddress && (
                    <p className="mt-1 max-w-xs">{businessInfo.businessAddress}</p>
                )}
                </div>
            </div>

            <div className="text-right">
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-sm text-gray-600 mt-1">
                {invoice.invoiceNumber}
                </p>
            </div>
            </div>

            {/* Bill To & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Bill To
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    {invoice.clientName}
                  </p>
                  {invoice.clientEmail && (
                    <p className="text-gray-600">{invoice.clientEmail}</p>
                  )}
                  {invoice.clientAddress && (
                    <p className="text-gray-600 mt-1">{invoice.clientAddress}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Issue Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(invoice.issueDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Due Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase w-20">
                      Qty
                    </th>
                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase w-24">
                      Rate
                    </th>
                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase w-28">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-sm text-right text-gray-600">
                        ${parseFloat(item.rate || 0).toFixed(2)}
                      </td>
                      <td className="py-3 text-sm text-right text-gray-900 font-medium">
                        ${parseFloat(item.amount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    ${invoice.subtotal.toFixed(2)}
                  </span>
                </div>

                {invoice.discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Discount ({invoice.discountPercent}%)
                    </span>
                    <span className="text-gray-900 font-medium">
                      -${invoice.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${invoice.taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t-2 border-gray-900">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${invoice.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="pt-6 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Notes
                </p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">
                {businessInfo.plan === 'free' && 'Created with InvoSnap'}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Questions about this invoice?</p>
          <p>
            Contact {businessInfo.businessName} at{' '}
            <a 
              href={`mailto:${businessInfo.businessEmail}`}
              className="text-blue-600 hover:underline"
            >
              {businessInfo.businessEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}