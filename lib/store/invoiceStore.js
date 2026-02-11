// lib/store/invoiceStore.js
import { create } from 'zustand';
import { 
  generateId, 
  calculateItemAmount,
  calculateSubtotal,
  calculateDiscount,
  calculateTax,
  calculateTotal
} from '@/lib/invoice/calculator';

// EXPLANATION: Zustand creates a global state store
// Any component can access/update this data
export const useInvoiceStore = create((set, get) => ({
  // Initial state
  invoice: {
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [
      {
        id: generateId(),
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    templateId: 'professional'
  },

  // EXPLANATION: Actions to update state
  
  // Set client info
  setClient: (client) => set((state) => ({
    invoice: {
      ...state.invoice,
      clientId: client.id || '',
      clientName: client.name || '',
      clientEmail: client.email || '',
      clientAddress: client.address || ''
    }
  })),

  // Set invoice number and dates
  setInvoiceDetails: (details) => set((state) => ({
    invoice: { ...state.invoice, ...details }
  })),

  // Add new line item
  addItem: () => set((state) => ({
    invoice: {
      ...state.invoice,
      items: [
        ...state.invoice.items,
        {
          id: generateId(),
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ]
    }
  })),

  // Update existing line item
  updateItem: (id, field, value) => set((state) => {
    const items = state.invoice.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalculate amount if quantity or rate changed
        if (field === 'quantity' || field === 'rate') {
          updated.amount = calculateItemAmount(updated.quantity, updated.rate);
        }
        
        return updated;
      }
      return item;
    });

    // Recalculate totals
    const subtotal = calculateSubtotal(items);
    const discountAmount = calculateDiscount(subtotal, state.invoice.discountPercent);
    const taxAmount = calculateTax(subtotal, discountAmount, state.invoice.taxRate);
    const total = calculateTotal(subtotal, discountAmount, taxAmount);

    return {
      invoice: {
        ...state.invoice,
        items,
        subtotal,
        discountAmount,
        taxAmount,
        total
      }
    };
  }),

  // Remove line item
  removeItem: (id) => set((state) => {
    // Don't allow removing last item
    if (state.invoice.items.length === 1) return state;

    const items = state.invoice.items.filter(item => item.id !== id);
    
    // Recalculate totals
    const subtotal = calculateSubtotal(items);
    const discountAmount = calculateDiscount(subtotal, state.invoice.discountPercent);
    const taxAmount = calculateTax(subtotal, discountAmount, state.invoice.taxRate);
    const total = calculateTotal(subtotal, discountAmount, taxAmount);

    return {
      invoice: {
        ...state.invoice,
        items,
        subtotal,
        discountAmount,
        taxAmount,
        total
      }
    };
  }),

  // Update discount
  setDiscount: (percent) => set((state) => {
    const discountAmount = calculateDiscount(state.invoice.subtotal, percent);
    const taxAmount = calculateTax(state.invoice.subtotal, discountAmount, state.invoice.taxRate);
    const total = calculateTotal(state.invoice.subtotal, discountAmount, taxAmount);

    return {
      invoice: {
        ...state.invoice,
        discountPercent: percent,
        discountAmount,
        taxAmount,
        total
      }
    };
  }),

  // Update tax rate
  setTaxRate: (rate) => set((state) => {
    const taxAmount = calculateTax(state.invoice.subtotal, state.invoice.discountAmount, rate);
    const total = calculateTotal(state.invoice.subtotal, state.invoice.discountAmount, taxAmount);

    return {
      invoice: {
        ...state.invoice,
        taxRate: rate,
        taxAmount,
        total
      }
    };
  }),

  // Set notes
  setNotes: (notes) => set((state) => ({
    invoice: { ...state.invoice, notes }
  })),

  // Set template
  setTemplate: (templateId) => set((state) => ({
    invoice: { ...state.invoice, templateId }
  })),

  // Reset invoice (for new invoice)
  resetInvoice: () => set({
    invoice: {
      clientId: '',
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      invoiceNumber: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [
        {
          id: generateId(),
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ],
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 0,
      notes: '',
      templateId: 'professional'
    }
  }),

  // Load existing invoice (for editing)
  loadInvoice: (invoiceData) => set({
    invoice: invoiceData
  })
}));