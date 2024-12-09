import { Clock, Search } from "lucide-react";
import { useResearchStore } from "../store/researchStore";
import { formatDistanceToNow } from "date-fns";

export function ResearchHistory() {
    const history = useResearchStore((state) => state.history);
    const loadResearch = useResearchStore((state) => state.loadResearch);
    const isLoading = useResearchStore((state) => state.isLoading);

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <Search className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm text-center">No research history yet</p>
            </div>
        );
    }

    return (
        <div className="divide-y">
            {history.map((entry) => (
                <button
                    key={entry.id}
                    onClick={() => loadResearch(entry.id)}
                    disabled={isLoading}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {entry.originalQuery}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                            {formatDistanceToNow(new Date(entry.createdAt))} ago
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}
