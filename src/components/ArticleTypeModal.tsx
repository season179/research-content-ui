import { X, FileText, Mail, Linkedin } from "lucide-react";
import { useEffect, useRef } from "react";

interface ArticleTypeModalProps {
    onSelect: (type: "tweet" | "blog" | "newsletter" | "linkedin") => void;
    onClose: () => void;
    isOpen: boolean;
}

export function ArticleTypeModal({
    onSelect,
    onClose,
    isOpen,
}: ArticleTypeModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const options = [
        { 
            type: "tweet" as const, 
            icon: X, 
            label: "Tweet Thread",
            description: "A series of connected tweets"
        },
        { 
            type: "blog" as const, 
            icon: FileText, 
            label: "Blog Post",
            description: "A detailed article with sections"
        },
        { 
            type: "newsletter" as const, 
            icon: Mail, 
            label: "Newsletter",
            description: "An engaging email update"
        },
        { 
            type: "linkedin" as const, 
            icon: Linkedin, 
            label: "LinkedIn Post",
            description: "A professional network update"
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
                ref={modalRef}
                className="bg-white rounded-xl p-6 max-w-md w-full"
            >
                <h2 className="text-xl font-semibold mb-4">
                    Choose Content Type
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {options.map(({ type, icon: Icon, label, description }) => (
                        <button
                            key={type}
                            onClick={() => {
                                onSelect(type);
                                onClose();
                            }}
                            className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-medium">{label}</div>
                                <div className="text-sm text-gray-600">{description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
