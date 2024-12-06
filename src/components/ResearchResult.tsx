import React from 'react';
import { Copy, Plus, PenLine } from 'lucide-react';

interface ResearchResultProps {
  content: string;
  onCopy: () => void;
  onMoreResearch: () => void;
  onCreateArticle: () => void;
  isLoading: boolean;
}

export function ResearchResult({
  content,
  onCopy,
  onMoreResearch,
  onCreateArticle,
  isLoading,
}: ResearchResultProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <div className="prose max-w-none mb-6">
        {content}
      </div>
      
      <div className="flex flex-wrap gap-4 justify-end border-t pt-4">
        <button
          onClick={onCopy}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
        
        <button
          onClick={onMoreResearch}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          More Research
        </button>
        
        <button
          onClick={onCreateArticle}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors"
        >
          <PenLine className="w-4 h-4" />
          Create Article
        </button>
      </div>
    </div>
  );
}