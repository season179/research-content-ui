import React from 'react';
import { Copy } from 'lucide-react';

interface ArticleContentProps {
  content: string;
  type: 'tweet' | 'blog' | 'newsletter' | 'linkedin';
  onCopy: () => void;
}

export function ArticleContent({ content, type, onCopy }: ArticleContentProps) {
  const typeLabels = {
    tweet: 'Tweet',
    blog: 'Blog Post',
    newsletter: 'Newsletter',
    linkedin: 'LinkedIn Post'
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          {typeLabels[type]}
        </h3>
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>
      
      <div className="prose max-w-none whitespace-pre-wrap border-t pt-4">
        {content}
      </div>
    </div>
  );
}