// components/landing/Footer.js
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">InvoSnap</span>
            </div>
            <p className="text-sm text-gray-400">
              Professional invoices in 60 seconds. Built for freelancers and small businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><Link href="auth/signup" className="hover:text-white">Sign up</Link></li>
              <li><Link href="auth/login" className="hover:text-white">Log in</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:joelmbuyi700@gmail.com" className="hover:text-white">support@invosnap.com</a></li>
              <li><a href="https://github.com/JoelMbuyi05" className="hover:text-white">Github</a></li>
              <li><a href="https://www.linkedin.com/in/joelmbuyi05/" className="hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} InvoSnap. All rights reserved. Built By M. Joel</p>
        </div>
      </div>
    </footer>
  );
}