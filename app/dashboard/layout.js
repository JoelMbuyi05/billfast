// app/(dashboard)/layout.js
'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const { user, userData, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl">BillFast</span>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/clients">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Clients
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>

          {userData?.plan === 'free' && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Free Plan</p>
              <p className="text-xs text-gray-600 mb-3">
                {userData.invoicesThisMonth || 0}/5 invoices this month
              </p>
              <Button size="sm" className="w-full">
                Upgrade to Pro
              </Button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{userData?.businessName}</p>
              <p className="text-gray-500 text-xs">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  );
}