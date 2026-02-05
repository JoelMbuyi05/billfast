// app/(dashboard)/page.js
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/dashboard/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
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
        </div>
      </Card>
    </div>
  );
}