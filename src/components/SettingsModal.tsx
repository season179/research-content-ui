import { useState } from "react";
import { X, Eye, EyeOff, Lock, Trash2 } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ApiKeys {
  openai: string;
  tavily: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKeys: ApiKeys;
  onUpdateKeys: (keys: ApiKeys) => Promise<void>;
  onDeleteKeys: () => Promise<void>;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentKeys,
  onUpdateKeys,
  onDeleteKeys,
}: SettingsModalProps) {
  const [keys, setKeys] = useState(currentKeys);
  const [showKeys, setShowKeys] = useState({
    openai: false,
    tavily: false,
  });
  const [errors, setErrors] = useState({
    openai: "",
    tavily: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

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
        await onUpdateKeys(keys);
        onClose();
      } catch (error) {
        console.error("Failed to update API keys:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteKeys();
      onClose();
    } catch (error) {
      console.error("Failed to delete API keys:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleKeyVisibility = (keyType: keyof typeof showKeys) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyType]: !prev[keyType],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage API Keys</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
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
                    setKeys((prev) => ({
                      ...prev,
                      openai: e.target.value,
                    }))
                  }
                  placeholder="sk-..."
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.openai ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility("openai")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.openai ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.openai && (
                <p className="mt-2 text-sm text-red-600">{errors.openai}</p>
              )}
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
                    setKeys((prev) => ({
                      ...prev,
                      tavily: e.target.value,
                    }))
                  }
                  placeholder="tvly-..."
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.tavily ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility("tavily")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.tavily ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.tavily && (
                <p className="mt-2 text-sm text-red-600">{errors.tavily}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Keys"
                )}
              </button>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Keys
                </button>
              ) : (
                <div className="border rounded-lg p-4 bg-red-50">
                  <p className="text-sm text-red-700 mb-3">
                    Are you sure you want to delete your API keys? You'll need to enter them again to use the app.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <div className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="sm" />
                          <span>Deleting...</span>
                        </div>
                      ) : (
                        "Yes, Delete"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
