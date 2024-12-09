import { create } from "zustand";
import {
    generateTweet,
    generateBlogPost,
    generateNewsletter,
    generateLinkedInPost,
} from "../services/content";
import type { ResearchData } from "../hooks/useResearch";

export interface ArticleContentType {
    content: string;
    type: "tweet" | "blog" | "newsletter" | "linkedin";
    isLoading: boolean;
}

interface ContentState {
    articleContents: ArticleContentType[];
    activeTab: string | null;
    isContentGenerating: boolean;
    error: string;
    setActiveTab: (tab: string | null) => void;
    handleArticleType: (
        type: "tweet" | "blog" | "newsletter" | "linkedin",
        researchData: ResearchData
    ) => Promise<void>;
    removeContent: (index: number) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
    articleContents: [],
    activeTab: null,
    isContentGenerating: false,
    error: "",

    setActiveTab: (tab) => set({ activeTab: tab }),

    handleArticleType: async (type, researchData) => {
        if (!researchData) return;

        set({ isContentGenerating: true });

        const { articleContents } = get();
        const existingIndex = articleContents.findIndex(
            (content) => content.type === type
        );

        if (existingIndex !== -1) {
            set((state) => ({
                articleContents: state.articleContents.map((content, index) =>
                    index === existingIndex
                        ? { ...content, isLoading: true }
                        : content
                ),
            }));
        } else {
            set((state) => ({
                articleContents: [
                    ...state.articleContents,
                    { type, content: "", isLoading: true },
                ],
            }));
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

            set((state) => {
                const existingIndex = state.articleContents.findIndex(
                    (content) => content.type === type
                );
                if (existingIndex !== -1) {
                    return {
                        articleContents: state.articleContents.map(
                            (content, index) =>
                                index === existingIndex
                                    ? {
                                          type,
                                          content: generatedContent,
                                          isLoading: false,
                                      }
                                    : content
                        ),
                    };
                }
                return {
                    articleContents: [
                        ...state.articleContents,
                        {
                            type,
                            content: generatedContent,
                            isLoading: false,
                        },
                    ],
                };
            });
        } catch (error) {
            console.error("Error generating content:", error);
            set((state) => ({
                error: "Failed to generate content. Please try again.",
                articleContents: state.articleContents.filter(
                    (content) => content.type !== type
                ),
            }));
            if (get().articleContents.length === 0) {
                set({ isContentGenerating: false });
            }
        } finally {
            set({ isContentGenerating: false });
        }
    },

    removeContent: (index) => {
        set((state) => {
            const newContents = state.articleContents.filter(
                (_, i) => i !== index
            );
            if (newContents.length === 0) {
                return {
                    articleContents: newContents,
                    isContentGenerating: false,
                    activeTab: null,
                };
            }
            return { articleContents: newContents };
        });
    },
}));
