import { create } from "zustand";
import { apiKeyDB } from "../utils/apiKeyDB";

interface ApiKeys {
    openai: string;
    tavily: string;
}

interface ApiKeysState {
    apiKeys: ApiKeys;
    isInitialized: boolean;
    error: string;
    initializeKeys: () => Promise<void>;
    setApiKeys: (keys: ApiKeys) => Promise<void>;
    deleteKeys: () => Promise<void>;
}

export const useApiKeysStore = create<ApiKeysState>((set) => ({
    apiKeys: {
        openai: "",
        tavily: "",
    },
    isInitialized: false,
    error: "",

    initializeKeys: async () => {
        try {
            const keys = await apiKeyDB.getApiKeys();
            const hasValidKeys = keys.openai && keys.tavily;
            set({
                apiKeys: keys,
                isInitialized: !!hasValidKeys,
                error: !hasValidKeys
                    ? "Please enter your API keys to get started"
                    : "",
            });
        } catch (error) {
            console.error(error);
            set({
                error: "Failed to initialize API keys",
                isInitialized: false,
            });
        }
    },

    setApiKeys: async (keys: ApiKeys) => {
        try {
            await apiKeyDB.saveApiKeys(keys);
            set({ apiKeys: keys, error: "" });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to save API keys" });
            throw error;
        }
    },

    deleteKeys: async () => {
        try {
            await apiKeyDB.deleteApiKeys();
            set({
                apiKeys: { openai: "", tavily: "" },
                error: "",
            });
        } catch (error) {
            console.error(error);
            set({ error: "Failed to delete API keys" });
            throw error;
        }
    },
}));
