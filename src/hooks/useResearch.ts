import { useState } from "react";
import { performResearch } from "../services/research";
import posthog from 'posthog-js';

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

export function useResearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [researchData, setResearchData] = useState<ResearchData | null>(null);
    const [error, setError] = useState<string>("");

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
            posthog.capture('load_more_results_clicked', {
                original_query: researchData.originalQuery,
                current_page: researchData.currentPage,
                next_page: nextPage,
                timestamp: new Date().toISOString()
            });
            
            const moreResults = await performResearch(
                researchData.originalQuery,
                nextPage,
                false
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

    return {
        isLoading,
        researchData,
        error,
        handleResearch,
        handleMoreResearch,
    };
}
