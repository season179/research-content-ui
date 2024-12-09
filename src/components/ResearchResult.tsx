import { Copy, Plus, PenLine } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface SearchResult {
    title: string;
    url: string;
    content: string;
}

interface ResearchResultProps {
    originalQuery: string;
    refinedQuery: string;
    results: SearchResult[];
    onMoreResearch: () => void;
    onCreateArticle: () => void;
    isLoading: boolean;
}

export function ResearchResult({
    originalQuery,
    refinedQuery,
    results,
    onMoreResearch,
    onCreateArticle,
    isLoading,
}: ResearchResultProps) {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        // Create the formatted text
        const formattedText =
            `Original Query: ${originalQuery}\nRefined Query: ${refinedQuery}\n\n` +
            results
                .map(
                    (result) =>
                        `${result.title}\n${result.url}\n\n${result.content}`
                )
                .join("\n\n---\n\n");

        // Create a temporary textarea element
        const textarea = document.createElement("textarea");
        textarea.value = formattedText;
        textarea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();

        try {
            // Execute the copy command
            document.execCommand("copy");
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy text:", err);
        } finally {
            // Clean up
            document.body.removeChild(textarea);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-500 ease-in-out">
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                    <div className="mb-2">
                        <span className="font-medium">Original query:</span>{" "}
                        {originalQuery}
                    </div>
                    <div>
                        <span className="font-medium">Refined query:</span>{" "}
                        {refinedQuery}
                    </div>
                </div>
            </div>

            <div className="prose max-w-none mb-6 space-y-4">
                {results.map((result, index) => (
                    <div
                        key={`${result.url}-${index}`}
                        className="border-b last:border-b-0 pb-4 last:pb-0"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                {result.title}
                            </a>
                        </h3>
                        <p className="text-gray-700">{result.content}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-end border-t pt-4">
                <button
                    onClick={handleCopy}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                        copySuccess
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                    <Copy
                        className={`w-4 h-4 ${
                            copySuccess ? "text-green-700" : ""
                        }`}
                    />
                    {copySuccess ? "Copied!" : "Copy"}
                </button>

                <button
                    onClick={onMoreResearch}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size="sm" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            <span>More Research</span>
                        </>
                    )}
                </button>

                <button
                    onClick={onCreateArticle}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                    <PenLine className="w-4 h-4" />
                    Create Article
                </button>
            </div>
        </div>
    );
}
