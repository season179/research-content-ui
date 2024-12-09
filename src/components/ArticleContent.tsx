import { Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { LoadingSpinner } from "./LoadingSpinner";

interface ArticleContentProps {
    content: string;
    type: "tweet" | "blog" | "newsletter" | "linkedin";
    isLoading?: boolean;
    onRemove: () => void;
}

export function ArticleContent({ content, type, isLoading = false }: ArticleContentProps) {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Render content based on type
    const contentDisplay = type === 'tweet' ? (
        <div className="space-y-4">
            {content.split('\n').filter(Boolean).map((tweet, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap">{tweet}</p>
                </div>
            ))}
        </div>
    ) : type === 'linkedin' ? (
        <div className="prose prose-slate lg:prose-lg max-w-none space-y-4">
            {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="whitespace-pre-wrap">
                    {paragraph}
                </p>
            ))}
        </div>
    ) : type === 'blog' ? (
        <article className="prose prose-slate lg:prose-lg max-w-none">
            <ReactMarkdown
                components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="my-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc ml-6 my-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-6 my-4" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </article>
    ) : (
        <div className="prose prose-slate lg:prose-lg max-w-none">
            <ReactMarkdown>
                {content}
            </ReactMarkdown>
        </div>
    );

    return (
        <div className="h-full overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white pb-4">
                <div className="flex justify-end">
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                            copySuccess 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        <Copy className={`w-4 h-4 ${copySuccess ? 'text-green-700' : ''}`} />
                        {copySuccess ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="pb-6">
                {contentDisplay}
            </div>
        </div>
    );
}
