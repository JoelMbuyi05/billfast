// lib/invoice/save.js
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// EXPLANATION: Save new invoice to Firestore
export async function saveInvoice(userId, invoiceData) {
  try {
    // Create invoice document
    const invoiceRef = await addDoc(collection(db, 'invoices'), {
      userId,
      ...invoiceData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Increment user's next invoice number
    await updateDoc(doc(db, 'users', userId), {
      nextInvoiceNumber: increment(1),
      invoicesThisMonth: increment(1)
    });

    return invoiceRef.id;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
}

// EXPLANATION: Update existing invoice
export async function updateInvoice(invoiceId, invoiceData) {
  try {
    await updateDoc(doc(db, 'invoices', invoiceId), {
      ...invoiceData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
}

// EXPLANATION: Validate invoice before saving
export function validateInvoice(invoice) {
  const errors = [];

  if (!invoice.clientId) {
    errors.push('Please select a client');
  }

  if (!invoice.items || invoice.items.length === 0) {
    errors.push('Add at least one item');
  }

  // Check if items have descriptions
  const hasEmptyItems = invoice.items.some(item => !item.description);
  if (hasEmptyItems) {
    errors.push('All items must have a description');
  }

  // Check if items have valid amounts
  const hasInvalidAmounts = invoice.items.some(item => item.amount <= 0);
  if (hasInvalidAmounts) {
    errors.push('All items must have a quantity and rate');
  }

  if (!invoice.invoiceNumber) {
    errors.push('Invoice number is required');
  }

  if (!invoice.issueDate) {
    errors.push('Issue date is required');
  }

  if (!invoice.dueDate) {
    errors.push('Due date is required');
  }

  return errors;
}