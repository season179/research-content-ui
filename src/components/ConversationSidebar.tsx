import { MessageCircle, Plus, Trash2 } from "lucide-react";

interface Conversation {
    id: string;
    topic: string;
    timestamp: Date;
}

interface ConversationSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (id: string) => void;
}

export function ConversationSidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
}: ConversationSidebarProps) {
    return (
        <div className="w-64 h-screen bg-gray-200 text-white flex flex-col">
            <div className="p-4 border-b border-gray-300">
                <button
                    onClick={onNewConversation}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                    <div
                        key={conversation.id}
                        className={`group flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-300 transition-colors ${
                            activeConversationId === conversation.id
                                ? "bg-gray-300"
                                : ""
                        }`}
                        onClick={() => onSelectConversation(conversation.id)}
                    >
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                                {conversation.topic}
                            </p>
                            <p className="text-xs text-gray-400">
                                {conversation.timestamp.toLocaleDateString()}
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(conversation.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                        >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
