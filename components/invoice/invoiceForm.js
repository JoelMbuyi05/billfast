// components/invoice/InvoiceForm.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

export default function InvoiceForm() {
  const { user } = useAuth();
  const { 
    invoice, 
    setClient,
    setInvoiceDetails,
    addItem,
    updateItem,
    removeItem,
    setDiscount,
    setTaxRate,
    setNotes
  } = useInvoiceStore();

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  // EXPLANATION: Fetch user's clients for dropdown
  useEffect(() => {
    async function fetchClients() {
      try {
        const q = query(
          collection(db, 'clients'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const clientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoadingClients(false);
      }
    }

    if (user) {
      fetchClients();
    }
  }, [user]);

  // EXPLANATION: Handle client selection
  function handleClientChange(e) {
    const clientId = e.target.value;
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setClient(selectedClient);
    }
  }

  return (
    <div className="space-y-6">
      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Client</Label>
            {loadingClients ? (
              <p className="text-sm text-gray-500">Loading clients...</p>
            ) : clients.length === 0 ? (
              <div className="text-sm text-gray-500">
                No clients yet. <a href="/dashboard/clients/new" className="text-blue-600 underline">Add one</a>
              </div>
            ) : (
              <select
                value={invoice.clientId}
                onChange={handleClientChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Choose a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Show selected client info */}
          {invoice.clientName && (
            <div className="p-3 bg-gray-50 rounded-md text-sm">
              <p className="font-medium">{invoice.clientName}</p>
              {invoice.clientEmail && <p className="text-gray-600">{invoice.clientEmail}</p>}
              {invoice.clientAddress && <p className="text-gray-600 text-xs mt-1">{invoice.clientAddress}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoiceDetails({ invoiceNumber: e.target.value })}
                placeholder="INV-0001"
              />
            </div>

            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={invoice.issueDate}
                onChange={(e) => setInvoiceDetails({ issueDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoiceDetails({ dueDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoice.items.map((item, index) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  {invoice.items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Website Design"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Rate</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Amount</Label>
                      <Input
                        value={item.amount.toFixed(2)}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculations */}
      <Card>
        <CardHeader>
          <CardTitle>Calculations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoice.discountPercent}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                -${invoice.discountAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Tax (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoice.taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-600">
                +${invoice.taxAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">${invoice.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={invoice.notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thank you for your business!"
            rows={3}
            className="w-full px-3 py-2 border rounded-md"
          />
        </CardContent>
      </Card>
    </div>
  );
}