import { create } from "zustand";
import { performResearch } from "../services/research";
import { researchDB } from "../utils/researchDB";

interface SearchResult {
    title: string;
    url: string;
    content: string;
}

export interface ResearchData {
    id: string;
    originalQuery: string;
    refinedQuery: string | null;
    results: SearchResult[];
    currentPage?: number;
}

interface ResearchState {
    isLoading: boolean;
    researchData: ResearchData | null;
    error: string;
    isInitialized: boolean;
    handleResearch: (topic: string, enhance: boolean) => Promise<void>;
    handleMoreResearch: () => Promise<void>;
    initializeResearch: () => Promise<void>;
}

export const useResearchStore = create<ResearchState>((set, get) => ({
    isLoading: false,
    researchData: null,
    error: "",
    isInitialized: false,

    initializeResearch: async () => {
        try {
            await researchDB.init();
            set({ isInitialized: true });
        } catch (error) {
            console.error("Failed to initialize research database:", error);
            set({ error: "Failed to initialize research database" });
        }
    },

    handleResearch: async (topic: string, enhance: boolean) => {
        set({ isLoading: true, error: "" });
        try {
            const results = await performResearch(topic, 1, enhance);
            const entry = await researchDB.createResearch(
                topic,
                results.refinedQuery,
                results.results
            );

            const researchDataWithPage: ResearchData = {
                id: entry.id,
                originalQuery: entry.originalQuery,
                refinedQuery: entry.refinedQuery,
                results: entry.results,
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

            // Append new results to the database
            const updatedEntry = await researchDB.appendResults(
                researchData.id,
                moreResults.results
            );

            set({
                researchData: {
                    ...researchData,
                    results: updatedEntry.results,
                    currentPage: nextPage,
                },
            });
        } catch (error) {
            console.error("More research error:", error);
            set({
                error: "Failed to load more results. Please try again.",
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));
