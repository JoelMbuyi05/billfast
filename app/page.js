// app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">InvoSnap</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
            Log in
          </Link>
          <Link 
            href="/auth/signup" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Create Professional Invoices <br />
          <span className="text-blue-600">in 60 Seconds</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          InvoSnap helps small businesses create, send, and track invoices effortlessly. 
          Get paid faster with automated reminders and online payments.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/auth/signup" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/auth/login" 
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-2">⚡ Fast Invoicing</h3>
            <p className="text-gray-600">Create professional invoices in minutes</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-2">📊 Track Everything</h3>
            <p className="text-gray-600">Monitor payments and client history</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="font-bold text-lg mb-2">💼 Business Ready</h3>
            <p className="text-gray-600">Scalable for businesses of all sizes</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 border-t">
        <p>&copy; 2024 InvoSnap. All rights reserved.</p>
      </footer>
    </div>
  );
}