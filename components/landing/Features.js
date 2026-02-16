// components/landing/Features.js
import { Zap, Mail, MessageCircle, FileText, Eye, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create professional invoices in under 60 seconds. No complex setup, no learning curve.',
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Ready',
    description: 'Send invoices directly via WhatsApp. Perfect for clients who prefer messaging.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Mail,
    title: 'Email Integration',
    description: 'Professional emails with PDF attachments sent automatically. Branded and beautiful.',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: FileText,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates. Customize colors, add your logo.',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Eye,
    title: 'Track Views',
    description: 'Know exactly when clients view your invoices. Never wonder if they received it.',
    color: 'text-pink-600 bg-pink-100'
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download professional PDFs anytime. Perfect for printing or offline sharing.',
    color: 'text-indigo-600 bg-indigo-100'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to get paid
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, powerful features that help you create invoices and get paid faster
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}