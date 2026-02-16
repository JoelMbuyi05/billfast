// components/landing/FAQ.js
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is InvoSnap really free?',
    answer: 'Yes! InvoSnap is 100% free with unlimited invoices and clients. We may introduce optional premium features in the future, but the core invoicing functionality will always be free.'
  },
  {
    question: 'Do I need a credit card to sign up?',
    answer: 'No credit card required! Just sign up with your email and start creating invoices immediately.'
  },
  {
    question: 'Can I send invoices via WhatsApp?',
    answer: 'Yes! Generate a shareable link and send it directly via WhatsApp. This feature is available on all plans.'
  },
  {
    question: 'What file formats can I download?',
    answer: 'All invoices can be downloaded as professional PDF files that you can print or share offline.'
  },
  {
    question: 'Can I customize the invoice design?',
    answer: 'Yes! Choose from multiple professional templates and customize colors to match your brand.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use Firebase (Google) for secure authentication and data storage. Your data is encrypted and protected.'
  },
  {
    question: 'Can I track if clients viewed my invoice?',
    answer: 'Yes! You\'ll see when clients open and view your invoices, so you always know where things stand.'
  }
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-blue-600 transition-colors"
      >
        <span className="text-lg font-semibold text-gray-900 pr-8">
          {faq.question}
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-6 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about InvoSnap
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a 
            href="mailto:joelmbuyi700@gmail.com" 
            className="text-blue-600 hover:underline font-semibold"
          >
            Contact us →
          </a>
        </div>
      </div>
    </section>
  );
}