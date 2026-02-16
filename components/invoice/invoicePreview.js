// components/invoice/InvoicePreview.js
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { formatCurrency } from '@/lib/invoice/calculator';
import { format } from 'date-fns';
import Image from 'next/image'; 

export default function InvoicePreview() {
  const { userData } = useAuth();
  const { invoice } = useInvoiceStore();

  // EXPLANATION: Format date for display
  // "2024-02-05" → "Feb 5, 2024"
  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Paper effect */}
      <div className="p-4 md:p-8 lg:p-12">
        
        {/* Header - Business Info */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-0 mb-8">
          <div>
            {userData?.logoUrl && (
                    <Image 
                        src={userData.logoUrl} 
                        alt="Logo" 
                        fill
                        sizes="128px"
                        className="object-contain object-left"
                        unoptimized={true}
                    />
            )}
            <h2 className="text-xl font-bold">
              {userData?.businessName || 'Your Business'}
            </h2>
            <div className="text-sm text-gray-600 mt-1">
              {userData?.businessEmail && <p>{userData.businessEmail}</p>}
              {userData?.businessPhone && <p>{userData.businessPhone}</p>}
              {userData?.businessAddress && (
                <p className="mt-1 max-w-xs">{userData.businessAddress}</p>
              )}
            </div>
          </div>

          {/* Invoice Title */}
          <div className="md:text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-sm text-gray-600 mt-1">
              {invoice.invoiceNumber || 'INV-0001'}
            </p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
          {/* Bill To */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Bill To
            </p>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">
                {invoice.clientName || 'Select a client'}
              </p>
              {invoice.clientEmail && (
                <p className="text-gray-600">{invoice.clientEmail}</p>
              )}
              {invoice.clientAddress && (
                <p className="text-gray-600 mt-1">{invoice.clientAddress}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div>
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Issue Date
              </p>
              <p className="text-sm text-gray-900">
                {formatDate(invoice.issueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                Due Date
              </p>
              <p className="text-sm text-gray-900">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full table-fixed">
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
              {invoice.items.length > 0 && invoice.items[0].description ? (
                invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3 text-sm text-gray-900">
                      {item.description || 'Item description'}
                    </td>
                    <td className="py-3 text-sm text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-sm text-right text-gray-600">
                      ${formatCurrency(item.rate, userData?.currency)}
                    </td>
                    <td className="py-3 text-sm text-right text-gray-900 font-medium">
                      ${parseFloat(item.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">
                    Add items to see them here
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900 font-medium">
                ${invoice.subtotal.toFixed(2)}
              </span>
            </div>

            {/* Discount */}
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

            {/* Tax */}
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

            {/* Total */}
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
            {userData?.plan === 'free' && 'Created with InvoSnap'}
          </p>
        </div>
      </div>
    </div>
  );
}