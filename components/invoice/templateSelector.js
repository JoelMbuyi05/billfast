// components/invoice/TemplateSelector.js
'use client';

import { useInvoiceStore } from '@/lib/store/invoiceStore';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const templates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and formal',
    isPro: false
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Colorful and bold',
    isPro: true
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    isPro: true
  }
];

export default function TemplateSelector({ userPlan }) {
  const { invoice, setTemplate } = useInvoiceStore();

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Invoice Template</h3>
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => {
          const isLocked = template.isPro && userPlan === 'free';
          const isSelected = invoice.templateId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => !isLocked && setTemplate(template.id)}
              disabled={isLocked}
              className={`
                relative p-4 border-2 rounded-lg text-left transition-all
                ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300 cursor-pointer'}
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              
              {isLocked && (
                <div className="absolute top-2 right-2 text-xs bg-gray-900 text-white px-2 py-1 rounded">
                  Pro
                </div>
              )}

              <div className="aspect-[3/4] bg-gray-100 rounded mb-2 flex items-center justify-center text-xs text-gray-400">
                Preview
              </div>
              
              <p className="font-medium text-sm">{template.name}</p>
              <p className="text-xs text-gray-500">{template.description}</p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}