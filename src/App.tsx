import React, { useState } from 'react';
import { ResearchInput } from './components/ResearchInput';
import { ResearchResult } from './components/ResearchResult';
import { ArticleTypeModal } from './components/ArticleTypeModal';
import { ArticleContent } from './components/ArticleContent';
import { Brain } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [researchResult, setResearchResult] = useState<string>('');
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [articleContent, setArticleContent] = useState<{
    content: string;
    type: 'tweet' | 'blog' | 'newsletter' | 'linkedin';
  } | null>(null);

  const handleResearch = async (topic: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResearchResult(`Research results for: ${topic}...`);
    setArticleContent(null);
    setIsLoading(false);
  };

  const handleMoreResearch = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResearchResult(prev => prev + '\n\nAdditional research results...');
    setArticleContent(null);
    setIsLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleArticleType = async (type: 'tweet' | 'blog' | 'newsletter' | 'linkedin') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate content based on type without including research results
    let generatedContent = '';
    switch (type) {
      case 'tweet':
        generatedContent = 'Just discovered some fascinating insights about this topic! 🧵\n\nKey takeaway: [Generated insight]\n\n#Research #Innovation';
        break;
      case 'blog':
        generatedContent = '# The Ultimate Guide\n\nIn this comprehensive guide, we\'ll explore the fascinating world of this topic.\n\n## Key Insights\n\n1. First major point\n2. Second major point\n3. Third major point\n\n## Conclusion\n\nThis exploration reveals important implications for our understanding.';
        break;
      case 'newsletter':
        generatedContent = 'Dear Subscribers,\n\nThis week\'s newsletter brings you groundbreaking insights from our latest research.\n\nHighlights:\n• Key finding #1\n• Key finding #2\n• Key finding #3\n\nStay curious,\nYour Research Team';
        break;
      case 'linkedin':
        generatedContent = '🔍 Exciting new research findings!\n\nI\'m thrilled to share these insights with my professional network:\n\n💡 Key Insight #1\n📊 Supporting Data\n🎯 Practical Applications\n\n#ProfessionalDevelopment #Research #Innovation';
        break;
    }
    
    setArticleContent({ content: generatedContent, type });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Research Assistant</h1>
            <p className="text-gray-600">Enter a topic and let AI do the research for you</p>
          </div>

          <ResearchInput onSubmit={handleResearch} isLoading={isLoading} />

          {researchResult && (
            <ResearchResult
              content={researchResult}
              onCopy={() => handleCopy(researchResult)}
              onMoreResearch={handleMoreResearch}
              onCreateArticle={() => setShowArticleModal(true)}
              isLoading={isLoading}
            />
          )}

          {articleContent && (
            <ArticleContent
              content={articleContent.content}
              type={articleContent.type}
              onCopy={() => handleCopy(articleContent.content)}
            />
          )}

          <ArticleTypeModal
            isOpen={showArticleModal}
            onClose={() => setShowArticleModal(false)}
            onSelect={handleArticleType}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
