// components/landing/HowItWorks.js
import { FileText, Palette, Send } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: FileText,
    title: 'Fill in the details',
    description: 'Add your client info, line items, and payment terms. Takes less than a minute.',
    color: 'bg-blue-600'
  },
  {
    number: '2',
    icon: Palette,
    title: 'Choose your design',
    description: 'Pick a professional template and customize it with your branding.',
    color: 'bg-purple-600'
  },
  {
    number: '3',
    icon: Send,
    title: 'Send & get paid',
    description: 'Send via email or WhatsApp. Track when clients view it. Done!',
    color: 'bg-green-600'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to professional invoices
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 -z-10 hidden md:block"
                     style={{ display: index === steps.length - 1 ? 'none' : 'block' }}>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Total time: <span className="font-bold text-blue-600">Under 60 seconds</span> ⚡
          </p>
        </div>
      </div>
    </section>
  );
}