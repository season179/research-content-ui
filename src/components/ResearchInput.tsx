import React, { useState } from "react";
import { Search } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ResearchInputProps {
    onSubmit: (topic: string, enhance: boolean) => void;
    isLoading: boolean;
}

export function ResearchInput({ onSubmit, isLoading }: ResearchInputProps) {
    const [topic, setTopic] = useState("");
    const [enhanceQuery, setEnhanceQuery] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim()) {
            onSubmit(topic.trim(), enhanceQuery);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
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
                    {isLoading ? <LoadingSpinner size="sm" /> : <Search className="w-6 h-6" />}
                </button>
            </div>
            
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="enhance-query"
                    checked={enhanceQuery}
                    onChange={(e) => setEnhanceQuery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <label htmlFor="enhance-query" className="text-sm text-gray-600">
                    Enhance query with AI for better results
                </label>
            </div>
        </form>
    );
}
