// lib/invoice/calculator.js

// EXPLANATION: Generate unique ID for items
export function generateId() {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// EXPLANATION: Calculate amount for a single item
export function calculateItemAmount(quantity, rate) {
  const qty = parseFloat(quantity) || 0;
  const r = parseFloat(rate) || 0;
  return qty * r;
}

// EXPLANATION: Calculate subtotal (sum of all item amounts)
export function calculateSubtotal(items) {
  return items.reduce((sum, item) => {
    return sum + (parseFloat(item.amount) || 0);
  }, 0);
}

// EXPLANATION: Calculate discount amount
export function calculateDiscount(subtotal, discountPercent) {
  const percent = parseFloat(discountPercent) || 0;
  return (subtotal * percent) / 100;
}

// EXPLANATION: Calculate tax amount
export function calculateTax(subtotal, discountAmount, taxRate) {
  const taxableAmount = subtotal - discountAmount;
  const rate = parseFloat(taxRate) || 0;
  return (taxableAmount * rate) / 100;
}

// EXPLANATION: Calculate final total
export function calculateTotal(subtotal, discountAmount, taxAmount) {
  return subtotal - discountAmount + taxAmount;
}

// EXPLANATION: Format number as currency
export function formatCurrency(amount, currency = 'USD') {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    ZAR: 'R',
    INR: '₹'
  };
  
  const symbol = symbols[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
}

// EXPLANATION: Generate next invoice number
export function generateInvoiceNumber(prefix, nextNumber) {
  // Pad with zeros: 1 → 0001, 42 → 0042
  const paddedNumber = String(nextNumber).padStart(4, '0');
  return `${prefix}-${paddedNumber}`;
}

// EXPLANATION: Calculate due date from issue date and payment terms
export function calculateDueDate(issueDate, paymentTerms = 30) {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}