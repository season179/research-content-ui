import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ResearchInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

export function ResearchInput({ onSubmit, isLoading }: ResearchInputProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a research topic..."
          className="w-full px-4 py-3 pr-12 text-lg rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
}