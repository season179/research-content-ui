import { useState, useEffect } from "react";
import { ResearchInput } from "./components/ResearchInput";
import { ResearchResult } from "./components/ResearchResult";
import { ArticleTypeModal } from "./components/ArticleTypeModal";
import { ArticleContent } from "./components/ArticleContent";
import { ApiKeyInput } from "./components/ApiKeyInput";
import { Header } from "./components/Header";
import { SettingsModal } from "./components/SettingsModal";
import { apiKeyDB } from "./utils/db";
import { performResearch } from "./services/research";
import {
    generateTweet,
    generateBlogPost,
    generateNewsletter,
    generateLinkedInPost,
} from "./services/content";

// Define interfaces for data structures
interface ApiKeys {
    openai: string;
    tavily: string;
}

interface SearchResult {
    title: string;
    url: string;
    content: string;
}

interface ResearchData {
    originalQuery: string;
    refinedQuery: string;
    results: SearchResult[];
    currentPage?: number;
}

interface ArticleContentType {
    content: string;
    type: "tweet" | "blog" | "newsletter" | "linkedin";
    isLoading: boolean;
}

export function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [researchData, setResearchData] = useState<ResearchData | null>(null);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [articleContents, setArticleContents] = useState<ArticleContentType[]>([]);
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", tavily: "" });
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadApiKeys = async () => {
            try {
                const keys = await apiKeyDB.getApiKeys();
                setApiKeys(keys);
            } catch (error) {
                console.error("Failed to load API keys:", error);
                setError("Failed to load API keys");
            } finally {
                setIsInitialized(true);
            }
        };

        loadApiKeys();
    }, []);

    const handleApiKeysSubmit = async (keys: ApiKeys) => {
        try {
            await apiKeyDB.saveApiKeys(keys);
            setApiKeys(keys);
        } catch (error) {
            console.error("Failed to save API keys:", error);
            setError("Failed to save API keys");
        }
    };

    const handleDeleteKeys = async () => {
        try {
            await apiKeyDB.deleteApiKeys();
            setApiKeys({ openai: "", tavily: "" });
        } catch (error) {
            console.error("Failed to delete API keys:", error);
            throw error;
        }
    };

    const handleResearch = async (topic: string, enhance: boolean) => {
        setIsLoading(true);
        setError("");
        try {
            const results = await performResearch(topic, 1, enhance);
            const researchDataWithPage = {
                ...results,
                currentPage: 1,
            };
            setResearchData(researchDataWithPage);
            setArticleContents([]); // Clear previous content when starting new research
        } catch (error) {
            console.error("Research error:", error);
            setError(
                "Failed to perform research. Please check your API keys and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleMoreResearch = async () => {
        if (!researchData) return;

        setIsLoading(true);
        setError("");
        try {
            const nextPage = (researchData.currentPage || 1) + 1;
            const moreResults = await performResearch(
                researchData.originalQuery,
                nextPage,
                false // Don't enhance query for subsequent pages
            );

            const updatedResearchData = {
                ...researchData,
                results: [...researchData.results, ...moreResults.results],
                currentPage: nextPage,
            };

            setResearchData(updatedResearchData);
        } catch (error) {
            console.error("More research error:", error);
            setError("Failed to load more research results");
        } finally {
            setIsLoading(false);
        }
    };

    const handleArticleType = async (
        type: "tweet" | "blog" | "newsletter" | "linkedin"
    ) => {
        if (!researchData) return;

        // Check if this type already exists
        const existingIndex = articleContents.findIndex(
            (content) => content.type === type
        );
        
        // If it exists, update its loading state
        if (existingIndex !== -1) {
            const updatedContents = [...articleContents];
            updatedContents[existingIndex] = {
                ...updatedContents[existingIndex],
                isLoading: true,
            };
            setArticleContents(updatedContents);
        } else {
            // If it doesn't exist, add a new loading content
            setArticleContents((prev) => [
                ...prev,
                { type, content: "", isLoading: true },
            ]);
        }

        try {
            let generatedContent = "";

            switch (type) {
                case "tweet":
                    generatedContent = await generateTweet(researchData);
                    break;
                case "blog":
                    generatedContent = await generateBlogPost(researchData);
                    break;
                case "newsletter":
                    generatedContent = await generateNewsletter(researchData);
                    break;
                case "linkedin":
                    generatedContent = await generateLinkedInPost(researchData);
                    break;
            }

            // Update the content
            setArticleContents((prev) => {
                const existingIndex = prev.findIndex(
                    (content) => content.type === type
                );
                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                        type,
                        content: generatedContent,
                        isLoading: false,
                    };
                    return updated;
                }
                return [
                    ...prev,
                    { type, content: generatedContent, isLoading: false },
                ];
            });
        } catch (error) {
            console.error("Error generating content:", error);
            setError("Failed to generate content. Please try again.");
            
            // Remove the loading state if there was an error
            setArticleContents((prev) =>
                prev.filter((content) => content.type !== type)
            );
        }
    };

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-600">Loading...</div>
            </div>
        );
    }

    const hasValidKeys = apiKeys.openai && apiKeys.tavily;

    if (!hasValidKeys) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <ApiKeyInput onSubmit={handleApiKeysSubmit} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header onOpenSettings={() => setShowSettingsModal(true)} />

            <div className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center gap-8">
                        <ResearchInput
                            onSubmit={handleResearch}
                            isLoading={isLoading}
                        />

                        {error && (
                            <div className="w-full max-w-2xl bg-red-50 text-red-600 p-4 rounded-lg">
                                {error}
                            </div>
                        )}

                        {researchData && (
                            <ResearchResult
                                originalQuery={researchData.originalQuery}
                                refinedQuery={researchData.refinedQuery}
                                results={researchData.results}
                                onMoreResearch={handleMoreResearch}
                                onCreateArticle={() => setShowArticleModal(true)}
                                isLoading={isLoading}
                            />
                        )}

                        {articleContents.map((content, index) => (
                            <ArticleContent
                                key={`${content.type}-${index}`}
                                content={content.content}
                                type={content.type}
                                isLoading={content.isLoading}
                                onRemove={() => {
                                    setArticleContents((prev) =>
                                        prev.filter((_, i) => i !== index)
                                    );
                                }}
                            />
                        ))}

                        <ArticleTypeModal
                            isOpen={showArticleModal}
                            onClose={() => setShowArticleModal(false)}
                            onSelect={handleArticleType}
                            existingTypes={articleContents.map(
                                (content) => content.type
                            )}
                        />

                        <SettingsModal
                            isOpen={showSettingsModal}
                            onClose={() => setShowSettingsModal(false)}
                            currentKeys={apiKeys}
                            onUpdateKeys={handleApiKeysSubmit}
                            onDeleteKeys={handleDeleteKeys}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}