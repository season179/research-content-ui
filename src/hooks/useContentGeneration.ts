import { useState } from 'react';
import {
    generateTweet,
    generateBlogPost,
    generateNewsletter,
    generateLinkedInPost,
} from '../services/content';
import type { ResearchData } from '../hooks/useResearch';

interface ArticleContentType {
    content: string;
    type: "tweet" | "blog" | "newsletter" | "linkedin";
    isLoading: boolean;
}

export function useContentGeneration() {
    const [articleContents, setArticleContents] = useState<ArticleContentType[]>([]);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [isContentGenerating, setIsContentGenerating] = useState(false);
    const [error, setError] = useState<string>("");

    const handleArticleType = async (
        type: "tweet" | "blog" | "newsletter" | "linkedin",
        researchData: ResearchData
    ) => {
        if (!researchData) return;

        setIsContentGenerating(true);
        
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

    const removeContent = (index: number) => {
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
    };

    return {
        articleContents,
        activeTab,
        isContentGenerating,
        error,
        setActiveTab,
        handleArticleType,
        removeContent
    };
}
