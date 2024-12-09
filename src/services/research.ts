import { tavily } from "@tavily/core";
import OpenAI from "openai";
import { apiKeyDB } from "../utils/apiKeyDB";

async function refineSearchQuery(
    query: string,
    openaiApiKey: string
): Promise<string> {
    try {
        const openai = new OpenAI({
            apiKey: openaiApiKey,
            dangerouslyAllowBrowser: true,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a search query optimization expert. Your task is to transform user queries into clear, specific search queries that will yield the most relevant results. Focus on factual and informational aspects. Return only the optimized query without any explanation or additional text.",
                },
                {
                    role: "user",
                    content: query,
                },
            ],
        });

        return completion?.choices?.[0].message?.content?.trim() ?? query;
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to refine search query with OpenAI");
    }
}

export async function performResearch(
    topic: string,
    page: number = 1,
    enhance: boolean = true
) {
    try {
        const keys = await apiKeyDB.getApiKeys();
        if (!keys.tavily || !keys.openai) {
            throw new Error("API keys not found");
        }

        // Only refine the query on the first page and if enhancement is enabled
        const refinedQuery =
            page === 1 && enhance
                ? await refineSearchQuery(topic, keys.openai)
                : topic;

        const tvly = tavily({ apiKey: keys.tavily });
        const response = await tvly.search(refinedQuery, {
            days: 365,
            maxResults: 5,
        });

        return {
            originalQuery: topic,
            refinedQuery: enhance ? refinedQuery : topic,
            results: response.results,
        };
    } catch (error) {
        console.error("Research error:", error);
        throw new Error("Failed to perform research");
    }
}
