import { FileText, Mail, Linkedin, Twitter, X } from "lucide-react";
import { ArticleContent } from "./ArticleContent";

interface ContentTabsProps {
    contents: Array<{
        type: "tweet" | "blog" | "newsletter" | "linkedin";
        content: string;
        isLoading: boolean;
    }>;
    activeTab: string | null;
    onTabChange: (tab: string) => void;
    onRemoveContent: (index: number) => void;
}

export function ContentTabs({
    contents,
    activeTab,
    onTabChange,
    onRemoveContent,
}: ContentTabsProps) {
    if (contents.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-white rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center text-gray-500">
                    <p className="mb-2">No content generated yet</p>
                    <p className="text-sm">Click "Create Article" to get started</p>
                </div>
            </div>
        );
    }

    const typeIcons = {
        tweet: Twitter,
        blog: FileText,
        newsletter: Mail,
        linkedin: Linkedin,
    };

    const typeLabels = {
        tweet: "Tweet Thread",
        blog: "Blog Post",
        newsletter: "Newsletter",
        linkedin: "LinkedIn Post",
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex border-b">
                {contents.map((content, index) => {
                    const Icon = typeIcons[content.type];
                    return (
                        <button
                            key={`${content.type}-${index}`}
                            className={`flex items-center gap-2 px-4 py-3 border-r last:border-r-0 hover:bg-gray-50 transition-colors ${
                                activeTab === content.type
                                    ? "bg-blue-50 text-blue-600 border-b-2 border-b-blue-600 -mb-px"
                                    : "text-gray-600"
                            }`}
                            onClick={() => onTabChange(content.type)}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">
                                {typeLabels[content.type]}
                            </span>
                            <button
                                className="ml-2 p-1 rounded-full hover:bg-gray-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveContent(index);
                                }}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {contents.map((content, index) => (
                    <div
                        key={`content-${content.type}-${index}`}
                        className={activeTab === content.type ? "" : "hidden"}
                    >
                        <ArticleContent
                            content={content.content}
                            type={content.type}
                            isLoading={content.isLoading}
                            onRemove={() => onRemoveContent(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
