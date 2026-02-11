// app/(dashboard)/dashboard/invoices/new/page.js
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { generateInvoiceNumber, calculateDueDate } from '@/lib/invoice/calculator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import InvoiceForm from '@/components/invoice/invoiceForm';
import InvoicePreview from '@/components/invoice/invoicePreview';

export default function NewInvoicePage() {
  const { user, userData } = useAuth();
  const { invoice, setInvoiceDetails, resetInvoice } = useInvoiceStore();

  useEffect(() => {
    if (userData) {
      resetInvoice();
      
      const invoiceNumber = generateInvoiceNumber(
        userData.invoicePrefix || 'INV',
        userData.nextInvoiceNumber || 1
      );
      
      const dueDate = calculateDueDate(
        new Date().toISOString().split('T')[0],
        30
      );

      setInvoiceDetails({
        invoiceNumber,
        dueDate,
        taxRate: userData.taxRate || 0,
        notes: userData.defaultNotes || ''
      });
    }
  }, [userData, resetInvoice, setInvoiceDetails]);

  async function handleSaveDraft() {
    console.log('Saving invoice:', invoice);
    alert('Save functionality coming next!');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">New Invoice</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button>Preview & Send</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <InvoiceForm />
        </div>

        {/* Right: Live Preview */}
        <div className="lg:sticky lg:top-8 h-fit">
          <InvoicePreview />
        </div>
      </div>
    </div>
  );
}