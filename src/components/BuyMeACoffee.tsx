import { Pizza } from 'lucide-react';

export function BuyMeACoffee() {
  return (
    <a
      href="https://www.buymeacoffee.com/shizhen"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
    >
      <Pizza className="w-5 h-5" />
      <span className="font-medium">Buy me a pizza</span>
    </a>
  );
}
