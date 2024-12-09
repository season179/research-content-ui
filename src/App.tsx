import { useState, useEffect } from "react";
import { ResearchInput } from "./components/ResearchInput";
import { ResearchResult } from "./components/ResearchResult";
import { ArticleTypeModal } from "./components/ArticleTypeModal";
import { ContentTabs } from "./components/ContentTabs";
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
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isContentGenerating, setIsContentGenerating] = useState(false);

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
            setActiveTab(null);
            setIsContentGenerating(false);
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

        setIsContentGenerating(true);
        
        // Check if this type already exists
        const existingIndex = articleContents.findIndex(
            (content) => content.type === type
        );
        
        if (existingIndex !== -1) {
            const updatedContents = [...articleContents];
            updatedContents[existingIndex] = {
                ...updatedContents[existingIndex],
                isLoading: true,
            };
            setArticleContents(updatedContents);
        } else {
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
            setArticleContents((prev) =>
                prev.filter((content) => content.type !== type)
            );
            if (articleContents.length === 0) {
                setIsContentGenerating(false);
            }
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

            <main className="flex-1 overflow-hidden">
                <div className="container mx-auto px-4 py-8 h-full">
                    <div className="flex flex-col items-center gap-8 h-full">
                        {/* Search Input */}
                        <div className={`transition-all duration-500 ease-in-out ${
                            researchData ? 'w-full max-w-2xl' : 'w-full max-w-xl'
                        }`}>
                            <ResearchInput
                                onSubmit={handleResearch}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="w-full max-w-2xl bg-red-50 text-red-600 p-4 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Main Content Area */}
                        {researchData && (
                            <div className={`w-full transition-all duration-500 ease-in-out ${
                                isContentGenerating 
                                    ? 'flex gap-6' 
                                    : 'flex justify-center'
                            }`}>
                                {/* Research Results */}
                                <div className={`transition-all duration-500 ease-in-out ${
                                    isContentGenerating 
                                        ? 'w-1/2' 
                                        : 'w-full max-w-2xl'
                                }`}>
                                    <ResearchResult
                                        originalQuery={researchData.originalQuery}
                                        refinedQuery={researchData.refinedQuery}
                                        results={researchData.results}
                                        onMoreResearch={handleMoreResearch}
                                        onCreateArticle={() => setShowArticleModal(true)}
                                        isLoading={isLoading}
                                    />
                                </div>

                                {/* Generated Content */}
                                <div className={`w-1/2 overflow-hidden transition-all duration-500 ease-in-out ${
                                    isContentGenerating 
                                        ? 'opacity-100 translate-x-0' 
                                        : 'opacity-0 translate-x-full w-0'
                                }`}>
                                    {isContentGenerating && (
                                        <ContentTabs
                                            contents={articleContents}
                                            activeTab={activeTab}
                                            onTabChange={setActiveTab}
                                            onRemoveContent={(index) => {
                                                setArticleContents((prev) => {
                                                    const newContents = prev.filter((_, i) => i !== index);
                                                    if (newContents.length === 0) {
                                                        setIsContentGenerating(false);
                                                    }
                                                    return newContents;
                                                });
                                                if (articleContents.length === 1) {
                                                    setActiveTab(null);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            <ArticleTypeModal
                isOpen={showArticleModal}
                onClose={() => setShowArticleModal(false)}
                onSelect={(type) => {
                    handleArticleType(type);
                    setActiveTab(type);
                    setShowArticleModal(false);
                }}
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
    );
}
