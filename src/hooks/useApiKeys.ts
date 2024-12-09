import { useState, useEffect } from "react";
import { apiKeyDB } from "../utils/db";

interface ApiKeys {
    openai: string;
    tavily: string;
}

export function useApiKeys() {
    const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", tavily: "" });
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadApiKeys = async () => {
            try {
                const keys = await apiKeyDB.getApiKeys();
                setApiKeys(keys);
            } catch (error) {
                console.error("Failed to load API keys:", error);
                setError("Failed to load API keys");
            } finally {
                setIsInitialized(true);
            }
        };

        loadApiKeys();
    }, []);

    const handleApiKeysSubmit = async (keys: ApiKeys) => {
        try {
            await apiKeyDB.saveApiKeys(keys);
            setApiKeys(keys);
            setError("");
        } catch (error) {
            console.error("Failed to save API keys:", error);
            setError("Failed to save API keys");
        }
    };

    const handleDeleteKeys = async () => {
        try {
            await apiKeyDB.deleteApiKeys();
            setApiKeys({ openai: "", tavily: "" });
            setError("");
        } catch (error) {
            console.error("Failed to delete API keys:", error);
            throw error;
        }
    };

    return {
        apiKeys,
        isInitialized,
        error,
        handleApiKeysSubmit,
        handleDeleteKeys,
    };
}
