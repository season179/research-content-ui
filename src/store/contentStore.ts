import { create } from "zustand";
import {
    generateTweet,
    generateBlogPost,
    generateNewsletter,
    generateLinkedInPost,
} from "../services/content";
import type { ResearchData } from "./researchStore";
import { researchDB } from "../utils/researchDB";
import { CONTENT_TYPES, ContentType } from "../constants/contentTypes";

export interface ArticleContentType {
    content: string;
    type: ContentType;
    isLoading: boolean;
}

interface ContentState {
    articleContents: ArticleContentType[];
    activeTab: string | null;
    isContentGenerating: boolean;
    error: string;
    setActiveTab: (tab: string | null) => void;
    handleArticleType: (
        type: ContentType,
        researchData: ResearchData
    ) => Promise<void>;
    removeContent: (index: number) => void;
    clearContent: () => void;
    addExistingContent: (type: string, content: string) => void;
}

const isValidContentType = (type: string): type is ContentType => {
    return Object.values(CONTENT_TYPES).includes(type as ContentType);
};

const updateContentLoadingState = (
    articleContents: ArticleContentType[],
    type: ContentType,
    isLoading: boolean
): ArticleContentType[] => {
    const existingIndex = articleContents.findIndex(
        (content) => content.type === type
    );

    if (existingIndex !== -1) {
        return articleContents.map((content, index) =>
            index === existingIndex ? { ...content, isLoading } : content
        );
    }

    return [...articleContents, { type, content: "", isLoading }];
};

const generateContentByType = async (
    type: ContentType,
    researchData: ResearchData
): Promise<string> => {
    const queryToUse = researchData.refinedQuery || researchData.originalQuery;
    const researchWithQuery = { ...researchData, refinedQuery: queryToUse };

    switch (type) {
        case CONTENT_TYPES.TWEET:
            return generateTweet(researchWithQuery);
        case CONTENT_TYPES.BLOG:
            return generateBlogPost(researchWithQuery);
        case CONTENT_TYPES.NEWSLETTER:
            return generateNewsletter(researchWithQuery);
        case CONTENT_TYPES.LINKEDIN:
            return generateLinkedInPost(researchWithQuery);
        default:
            throw new Error(`Unsupported content type: ${type}`);
    }
};

const saveGeneratedArticleToDatabase = async (
    researchData: ResearchData,
    type: ContentType,
    generatedContent: string
) => {
    try {
        await researchDB.addArticle(researchData.id, {
            type,
            content: generatedContent,
        });
    } catch (error) {
        console.error("Failed to save article to database:", error);
    }
};

export const useContentStore = create<ContentState>((set) => ({
    articleContents: [],
    activeTab: null,
    isContentGenerating: false,
    error: "",

    setActiveTab: (tab) => set({ activeTab: tab }),

    handleArticleType: async (type, researchData) => {
        if (!researchData) {
            set({ error: "No research data available" });
            return;
        }

        set({ isContentGenerating: true, error: "" });

        try {
            // Update loading state
            set((state) => ({
                articleContents: updateContentLoadingState(
                    state.articleContents,
                    type,
                    true
                ),
            }));

            // Generate content
            const generatedContent = await generateContentByType(
                type,
                researchData
            );

            // Save generated article to database
            await saveGeneratedArticleToDatabase(
                researchData,
                type,
                generatedContent
            );

            // Update content
            set((state) => ({
                articleContents: updateContentLoadingState(
                    state.articleContents,
                    type,
                    false
                ).map((content) =>
                    content.type === type
                        ? { ...content, content: generatedContent }
                        : content
                ),
            }));
        } catch (error) {
            console.error("Content generation error:", error);
            set({ error: "Failed to generate content. Please try again." });

            // Reset loading state on error
            set((state) => ({
                articleContents: updateContentLoadingState(
                    state.articleContents,
                    type,
                    false
                ),
            }));
        } finally {
            set({ isContentGenerating: false });
        }
    },

    removeContent: (index) => {
        set((state) => ({
            articleContents: state.articleContents.filter(
                (_, i) => i !== index
            ),
            activeTab:
                state.articleContents.length <= 1 ? null : state.activeTab,
        }));
    },

    clearContent: () => {
        set({ articleContents: [], activeTab: null });
    },

    addExistingContent: (type: string, content: string) => {
        // Validate the content type before adding
        if (!isValidContentType(type)) {
            console.warn(`Invalid content type: ${type}`);
            return;
        }

        set((state) => ({
            articleContents: [
                ...state.articleContents,
                { type: type as ContentType, content, isLoading: false },
            ],
        }));
    },
}));
