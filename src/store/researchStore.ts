import { create } from "zustand";
import { performResearch } from "../services/research";

interface SearchResult {
    title: string;
    url: string;
    content: string;
}

export interface ResearchData {
    originalQuery: string;
    refinedQuery: string;
    results: SearchResult[];
    currentPage?: number;
}

interface ResearchState {
    isLoading: boolean;
    researchData: ResearchData | null;
    error: string;
    handleResearch: (topic: string, enhance: boolean) => Promise<void>;
    handleMoreResearch: () => Promise<void>;
}

export const useResearchStore = create<ResearchState>((set, get) => ({
    isLoading: false,
    researchData: null,
    error: "",

    handleResearch: async (topic: string, enhance: boolean) => {
        set({ isLoading: true, error: "" });
        try {
            const results = await performResearch(topic, 1, enhance);
            const researchDataWithPage = {
                ...results,
                currentPage: 1,
            };
            set({ researchData: researchDataWithPage });
        } catch (error) {
            console.error("Research error:", error);
            set({
                error: "Failed to perform research. Please check your API keys and try again.",
            });
        } finally {
            set({ isLoading: false });
        }
    },

    handleMoreResearch: async () => {
        const { researchData } = get();
        if (!researchData) return;

        set({ isLoading: true, error: "" });
        try {
            const nextPage = (researchData.currentPage || 1) + 1;
            const moreResults = await performResearch(
                researchData.originalQuery,
                nextPage,
                false
            );

            set({
                researchData: {
                    ...researchData,
                    results: [...researchData.results, ...moreResults.results],
                    currentPage: nextPage,
                },
            });
        } catch (error) {
            console.error("More research error:", error);
            set({ error: "Failed to load more research results" });
        } finally {
            set({ isLoading: false });
        }
    },
}));
