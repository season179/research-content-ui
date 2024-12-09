import { ResearchResult } from './ResearchResult';
import { ContentTabs } from './ContentTabs';

interface MainContentProps {
    researchData: any;
    isLoading: boolean;
    isContentGenerating: boolean;
    articleContents: any[];
    activeTab: string | null;
    onMoreResearch: () => void;
    onCreateArticle: () => void;
    onTabChange: (tab: string) => void;
    onRemoveContent: (index: number) => void;
}

export function MainContent({
    researchData,
    isLoading,
    isContentGenerating,
    articleContents,
    activeTab,
    onMoreResearch,
    onCreateArticle,
    onTabChange,
    onRemoveContent
}: MainContentProps) {
    return (
        <div className="w-full flex justify-center">
            <div className={`transition-all duration-500 ease-in-out flex gap-6 ${
                isContentGenerating 
                    ? 'w-full justify-between' 
                    : 'w-full max-w-2xl justify-center'
            }`}>
                {/* Research Results */}
                <div className={`transition-all duration-500 ease-in-out ${
                    isContentGenerating 
                        ? 'w-1/2' 
                        : 'w-full'
                }`}>
                    <ResearchResult
                        originalQuery={researchData.originalQuery}
                        refinedQuery={researchData.refinedQuery}
                        results={researchData.results}
                        onMoreResearch={onMoreResearch}
                        onCreateArticle={onCreateArticle}
                        isLoading={isLoading}
                    />
                </div>

                {/* Generated Content */}
                <div className={`w-1/2 overflow-hidden transition-all duration-500 ease-in-out ${
                    isContentGenerating 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-full hidden'
                }`}>
                    {isContentGenerating && (
                        <ContentTabs
                            contents={articleContents}
                            activeTab={activeTab}
                            onTabChange={onTabChange}
                            onRemoveContent={onRemoveContent}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
