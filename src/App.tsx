import { useState } from "react";
import { ResearchInput } from "./components/ResearchInput";
import { ArticleTypeModal } from "./components/ArticleTypeModal";
import { ApiKeyInput } from "./components/ApiKeyInput";
import { Header } from "./components/Header";
import { SettingsModal } from "./components/SettingsModal";
import { MainContent } from "./components/MainContent";
import { useApiKeys } from "./hooks/useApiKeys";
import { useResearch } from "./hooks/useResearch";
import { useContentGeneration } from "./hooks/useContentGeneration";

export function App() {
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const {
        apiKeys,
        isInitialized,
        error: apiKeyError,
        handleApiKeysSubmit,
        handleDeleteKeys,
    } = useApiKeys();

    const {
        isLoading,
        researchData,
        error: researchError,
        handleResearch,
        handleMoreResearch,
    } = useResearch();

    const {
        articleContents,
        activeTab,
        isContentGenerating,
        error: contentError,
        setActiveTab,
        handleArticleType,
        removeContent,
    } = useContentGeneration();

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

    const error = apiKeyError || researchError || contentError;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header onOpenSettings={() => setShowSettingsModal(true)} />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col items-center gap-8">
                    {/* Search Input */}
                    <div
                        className={`transition-all duration-500 ease-in-out ${
                            researchData
                                ? "w-full max-w-2xl"
                                : "w-full max-w-xl"
                        }`}
                    >
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
                        <MainContent
                            researchData={researchData}
                            isLoading={isLoading}
                            isContentGenerating={isContentGenerating}
                            articleContents={articleContents}
                            activeTab={activeTab}
                            onMoreResearch={handleMoreResearch}
                            onCreateArticle={() => setShowArticleModal(true)}
                            onTabChange={setActiveTab}
                            onRemoveContent={removeContent}
                        />
                    )}
                </div>
            </main>

            {/* Modals */}
            <ArticleTypeModal
                isOpen={showArticleModal}
                onClose={() => setShowArticleModal(false)}
                onSelect={(type) => {
                    handleArticleType(type, researchData!);
                    setActiveTab(type);
                    setShowArticleModal(false);
                }}
                existingTypes={articleContents.map((content) => content.type)}
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
