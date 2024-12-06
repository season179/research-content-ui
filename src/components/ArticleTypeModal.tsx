import React from 'react';
import { Twitter, FileText, Mail, Linkedin } from 'lucide-react';

interface ArticleTypeModalProps {
  onSelect: (type: 'tweet' | 'blog' | 'newsletter' | 'linkedin') => void;
  onClose: () => void;
  isOpen: boolean;
}

export function ArticleTypeModal({ onSelect, onClose, isOpen }: ArticleTypeModalProps) {
  if (!isOpen) return null;

  const options = [
    { type: 'tweet' as const, icon: Twitter, label: 'Tweet' },
    { type: 'blog' as const, icon: FileText, label: 'Blog Post' },
    { type: 'newsletter' as const, icon: Mail, label: 'Newsletter' },
    { type: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn Post' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Choose Article Type</h2>
        <div className="grid grid-cols-2 gap-4">
          {options.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => {
                onSelect(type);
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Icon className="w-8 h-8" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}