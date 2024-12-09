import { create } from "zustand";
import {
    generateTweet,
    generateBlogPost,
    generateNewsletter,
    generateLinkedInPost,
} from "../services/content";
import type { ResearchData } from "./researchStore";
import { researchDB } from "../utils/researchDB";

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
            const queryToUse =
                researchData.refinedQuery || researchData.originalQuery;

            switch (type) {
                case "tweet":
                    generatedContent = await generateTweet({
                        ...researchData,
                        refinedQuery: queryToUse,
                    });
                    break;
                case "blog":
                    generatedContent = await generateBlogPost({
                        ...researchData,
                        refinedQuery: queryToUse,
                    });
                    break;
                case "newsletter":
                    generatedContent = await generateNewsletter({
                        ...researchData,
                        refinedQuery: queryToUse,
                    });
                    break;
                case "linkedin":
                    generatedContent = await generateLinkedInPost({
                        ...researchData,
                        refinedQuery: queryToUse,
                    });
                    break;
            }

            // Save the generated article to the research database
            try {
                await researchDB.addArticle(researchData.id, {
                    type,
                    content: generatedContent,
                });
            } catch (error) {
                console.error("Failed to save article to database:", error);
            }

            set((state) => {
                const existingIndex = state.articleContents.findIndex(
                    (content) => content.type === type
                );
                if (existingIndex !== -1) {
                    return {
                        ...state,
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
                    ...state,
                    articleContents: [
                        ...state.articleContents,
                        { type, content: generatedContent, isLoading: false },
                    ],
                };
            });
        } catch (error) {
            console.error("Content generation error:", error);
            set((state) => {
                const existingIndex = state.articleContents.findIndex(
                    (content) => content.type === type
                );
                if (existingIndex !== -1) {
                    return {
                        ...state,
                        articleContents: state.articleContents.map(
                            (content, index) =>
                                index === existingIndex
                                    ? { ...content, isLoading: false }
                                    : content
                        ),
                        error: "Failed to generate content. Please try again.",
                    };
                }
                return {
                    ...state,
                    articleContents: state.articleContents.filter(
                        (content) => content.type !== type
                    ),
                    error: "Failed to generate content. Please try again.",
                };
            });
        } finally {
            set({ isContentGenerating: false });
        }
    },

    removeContent: (index) => {
        set((state) => ({
            articleContents: state.articleContents.filter(
                (_, i) => i !== index
            ),
        }));
    },
}));
