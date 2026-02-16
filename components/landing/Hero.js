// components/landing/Hero.js
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">InvoSnap</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it works</a>
            <Link href="auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Professional invoicing made simple
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Create invoices in{' '}
              <span className="text-blue-600">60 seconds</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              The fastest way to create professional invoices and get paid. 
              No accounting degree required. Perfect for freelancers and small businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Preview Image */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-200">
              {/* Mock Invoice Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="w-12 h-12 bg-blue-600 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded mt-2"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-6 w-24 bg-gray-900 rounded mb-2"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="h-3 w-40 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    <div className="h-6 w-24 bg-blue-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              ⚡ 60 sec
            </div>
            <div className="absolute -bottom-4 -left-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              📧 Email + WhatsApp
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}