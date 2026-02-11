// app/(dashboard)/dashboard/invoices/new/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { generateInvoiceNumber, calculateDueDate } from '@/lib/invoice/calculator';
import { saveInvoice, validateInvoice } from '@/lib/invoice/save';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import InvoiceForm from '@/components/invoice/invoiceForm';
import InvoicePreview from '@/components/invoice/invoicePreview';

export default function NewInvoicePage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const { invoice, setInvoiceDetails, resetInvoice } = useInvoiceStore();
  const [saving, setSaving] = useState(false);

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
    // Validate invoice
    const errors = validateInvoice(invoice);
    if (errors.length > 0) {
      alert('Please fix these errors:\n\n' + errors.join('\n'));
      return;
    }

    // Check free tier limit
    if (userData?.plan === 'free' && (userData.invoicesThisMonth || 0) >= 5) {
      alert('You\'ve reached the free tier limit of 5 invoices per month. Upgrade to Pro for unlimited invoices!');
      return;
    }

    try {
      setSaving(true);
      
      // Save to Firestore
      const invoiceId = await saveInvoice(user.uid, invoice);
      
      console.log('Invoice saved with ID:', invoiceId);
      
      // Show success message
      alert('Invoice saved as draft!');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving invoice: ' + error.message);
    } finally {
      setSaving(false);
    }
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
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button>Preview & Send</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <InvoiceForm />
        </div>

        <div className="lg:sticky lg:top-8 h-fit">
          <InvoicePreview />
        </div>
      </div>
    </div>
  );
}