// app/(dashboard)/dashboard/clients/new/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  
  // EXPLANATION: Each input needs its own state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  // EXPLANATION: This function updates state when user types
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,      // Keep existing data
      [name]: value // Update the field that changed
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent page refresh
    
    if (!formData.name || !formData.email) {
      return alert('Name and email are required');
    }

    try {
      setLoading(true);
      
      // Add client to Firestore
      await addDoc(collection(db, 'clients'), {
        userId: user.uid,
        ...formData,
        createdAt: new Date().toISOString()
      });

      // Update user's client count
      await updateDoc(doc(db, 'users', user.uid), {
        clientsCount: increment(1)
      });

      // Go back to clients list
      router.push('/dashboard/clients');
    } catch (error) {
      alert('Error adding client: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/clients">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Acme Corporation"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="billing@acme.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="123 Business St, City, State, ZIP"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Client'}
              </Button>
              <Link href="/dashboard/clients">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}