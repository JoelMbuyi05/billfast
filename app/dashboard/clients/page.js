// app/dashboard/clients/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Mail, Phone, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  const { user, userData } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // EXPLANATION: useEffect runs when component loads
  // We fetch clients from Firestore and store in state
  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  async function fetchClients() {
    try {
      // EXPLANATION: Query Firestore for clients belonging to this user
      const q = query(
        collection(db, 'clients'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      
      // EXPLANATION: Convert Firestore docs to array of objects
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(clientId) {
    if (!confirm('Delete this client? This cannot be undone.')) return;
    
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      // Remove from state (update UI)
      setClients(clients.filter(c => c.id !== clientId));
    } catch (error) {
      alert('Error deleting client: ' + error.message);
    }
  }

  if (loading) {
    return <div>Loading clients...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
        </div>
          <Link href="/dashboard/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </Link>
      </div>

      {clients.length === 0 ? (
        // EMPTY STATE
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first client to start invoicing
          </p>
          <Link href="/dashboard/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </Card>
      ) : (
        // CLIENT LIST
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map(client => (
            <Card key={client.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <div className="flex gap-2">
                  <Link href={`/dashboard/clients/${client.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </div>
                )}
                {client.address && (
                  <p className="text-xs mt-2">{client.address}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}