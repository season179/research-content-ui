import React, { useState } from "react";
import { Key, Eye, EyeOff, Lock } from "lucide-react";

interface ApiKeys {
    openai: string;
    tavily: string;
}

interface ApiKeyInputProps {
    onSubmit: (keys: ApiKeys) => void;
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
    const [keys, setKeys] = useState({
        openai: "",
        tavily: "",
    });
    const [showKeys, setShowKeys] = useState({
        openai: false,
        tavily: false,
    });
    const [errors, setErrors] = useState({
        openai: "",
        tavily: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateKeys = () => {
        const newErrors = {
            openai: "",
            tavily: "",
        };

        if (!keys.openai.trim()) {
            newErrors.openai = "OpenAI API key is required";
        } else if (!keys.openai.startsWith("sk-") || keys.openai.length < 20) {
            newErrors.openai = "Please enter a valid OpenAI API key";
        }

        if (!keys.tavily.trim()) {
            newErrors.tavily = "Tavily API key is required";
        } else if (keys.tavily.length < 10) {
            newErrors.tavily = "Please enter a valid Tavily API key";
        }

        setErrors(newErrors);
        return !newErrors.openai && !newErrors.tavily;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateKeys()) {
            setIsSubmitting(true);
            try {
                await onSubmit(keys);
            } catch (error) {
                console.error("Failed to save API keys:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleKeyChange = (keyType: keyof ApiKeys, value: string) => {
        setKeys((prev) => ({
            ...prev,
            [keyType]: value,
        }));
        if (errors[keyType]) {
            setErrors((prev) => ({
                ...prev,
                [keyType]: "",
            }));
        }
    };

    const toggleKeyVisibility = (keyType: keyof ApiKeys) => {
        setShowKeys((prev) => ({
            ...prev,
            [keyType]: !prev[keyType],
        }));
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                    <Key className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        Enter Your API Keys
                    </h2>
                </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                    <div className="mt-1">
                        <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Your keys are secure</p>
                        <p>
                            API keys are stored locally in your browser's storage and never transmitted to our servers. The author has no access to your keys.
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* OpenAI API Key Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        OpenAI API Key
                    </label>
                    <div className="relative">
                        <input
                            type={showKeys.openai ? "text" : "password"}
                            value={keys.openai}
                            onChange={(e) =>
                                handleKeyChange("openai", e.target.value)
                            }
                            placeholder="sk-..."
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                                errors.openai
                                    ? "border-red-300"
                                    : "border-gray-300"
                            } ${isSubmitting ? "bg-gray-50" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => toggleKeyVisibility("openai")}
                            disabled={isSubmitting}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            {showKeys.openai ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.openai && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.openai}
                        </p>
                    )}
                    <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                        Get an OpenAI API key
                    </a>
                </div>

                {/* Tavily API Key Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tavily API Key
                    </label>
                    <div className="relative">
                        <input
                            type={showKeys.tavily ? "text" : "password"}
                            value={keys.tavily}
                            onChange={(e) =>
                                handleKeyChange("tavily", e.target.value)
                            }
                            placeholder="tvly-..."
                            disabled={isSubmitting}
                            className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                                errors.tavily
                                    ? "border-red-300"
                                    : "border-gray-300"
                            } ${isSubmitting ? "bg-gray-50" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => toggleKeyVisibility("tavily")}
                            disabled={isSubmitting}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                            {showKeys.tavily ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.tavily && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.tavily}
                        </p>
                    )}
                    <a
                        href="https://tavily.com/#api-key"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                        Get a Tavily API key
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isSubmitting ? "Saving..." : "Continue"}
                </button>
            </form>
        </div>
    );
}
