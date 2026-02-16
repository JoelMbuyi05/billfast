// app/(dashboard)/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Eye, MoreVertical, Download, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { generateWhatsAppLink } from '@/lib/whatsapp/share';

export default function DashboardPage() {
  const { user, userData } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  async function fetchInvoices() {
    try {
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const invoicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF(invoiceId, invoiceNumber) {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error downloading PDF');
    }
  }

  // ✅ FIXED: Complete handleSendEmail function
  async function handleSendEmail(invoiceId, clientEmail, clientName) {
    // Check if email exists
    if (!clientEmail) {
      alert(
        `❌ Cannot send email\n\n` +
        `This client (${clientName || 'Unknown'}) doesn't have an email address.\n\n` +
        `Please add an email to the client record first.`
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      alert(`❌ Invalid email format: ${clientEmail}`);
      return;
    }

    if (!confirm(`📧 Send invoice to ${clientName || 'client'} at ${clientEmail}?`)) return;

    try {
      setSendingEmail(true);

      const response = await fetch(`/api/invoices/${invoiceId}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          clientEmail,
          clientName,
          invoiceId 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      alert('✅ Invoice sent successfully! ✉️');
      
      // Refresh invoices
      fetchInvoices();
    } catch (error) {
      console.error('Send error:', error);
      alert('❌ Error sending email: ' + error.message);
    } finally {
      setSendingEmail(false);
    }
  }

  // ✅ WhatsApp share function
  function handleWhatsAppShare(invoice) {
    if (!invoice.clientPhone && !invoice.clientEmail) {
      alert('Client needs a phone number or email to share via WhatsApp');
      return;
    }

    const clientContact = invoice.clientPhone || invoice.clientEmail;
    
    const invoiceUrl = `${window.location.origin}/invoice/${invoice.id}`;
    
    const whatsappUrl = generateWhatsAppLink(
      invoice,
      {
        businessName: userData?.businessName || 'Your Business',
        businessEmail: userData?.businessEmail || user?.email
      },
      invoiceUrl
    );

    window.open(whatsappUrl, '_blank');
  }

  function getStatusColor(status) {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'viewed':
        return 'bg-purple-100 text-purple-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {invoices.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first invoice in 60 seconds
          </p>
          <Link href="/dashboard/invoices/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map(invoice => (
            <Card key={invoice.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                {/* Left: Invoice info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{invoice.invoiceNumber || 'INV-000'}</h3>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status || 'draft'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{invoice.clientName || 'No client'}</span>
                      <span className="mx-2">•</span>
                      <span>${invoice.total?.toFixed(2) || '0.00'}</span>
                      <span className="mx-2">•</span>
                      <span>
                        Due {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {invoice.status === 'draft' ? (
                    <>
                      <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      
                      {/* ✅ FIXED: Email button with proper props */}
                      <Button 
                        size="sm"
                        onClick={() => handleSendEmail(invoice.id, invoice.clientEmail, invoice.clientName)}
                        disabled={sendingEmail}
                      >
                        {sendingEmail ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </>
                        )}
                      </Button>

                      {/* WhatsApp button*/}
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleWhatsAppShare(invoice)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp
                        </Button>
                    </>
                  ) : (
                    <>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}