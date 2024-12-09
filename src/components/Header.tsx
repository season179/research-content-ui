import { Settings, Brain } from "lucide-react";
import { BuyMeACoffee } from "./BuyMeACoffee";

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold">Research Assistant & Content Writer</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <BuyMeACoffee />
            <button
              onClick={onOpenSettings}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Manage API Keys"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
