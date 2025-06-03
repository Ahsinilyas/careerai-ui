import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Copy, Share } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface BuildInPublicGeneratorProps {
  ikigaiData?: {
    passion: string[];
    mission: string[];
    profession: string[];
    vocation: string[];
    recommendedRoles: string[];
  };
  onGenerate: () => Promise<{ content: string; hashtags: string[] }>;
  isGenerating: boolean;
}

interface PostContent {
  content: string;
  hashtags: string[];
}

const BuildInPublicGenerator: React.FC<BuildInPublicGeneratorProps> = ({
  ikigaiData,
  onGenerate,
  isGenerating
}) => {
  const [generatedPost, setGeneratedPost] = useState<PostContent | null>(null);
  const [charCount, setCharCount] = useState(0);

  const handleGenerate = async () => {
    try {
      const post = await onGenerate();
      setGeneratedPost(post);
      setCharCount(post.content.length);
    } catch (error) {
      console.error('Error generating post:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPost) return;
    const fullPost = `${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`;
    await navigator.clipboard.writeText(fullPost);
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Build in Public</h3>
          <p className="text-sm text-gray-600">
            Generate LinkedIn posts based on your IKIGAI insights
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !ikigaiData}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Post'}
        </Button>
      </div>

      {!ikigaiData && (
        <p className="text-sm text-amber-600 mb-4">
          Complete your IKIGAI analysis to generate personalized posts
        </p>
      )}

      {generatedPost && (
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={`${generatedPost.content}\n\n${generatedPost.hashtags.join(' ')}`}
              readOnly
              className="min-h-[200px] bg-gray-50 pr-16"
            />
            <div className="absolute top-2 right-2 text-xs text-gray-500">
              {charCount}/350
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={copyToClipboard} className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                window.open('https://www.linkedin.com/sharing/share-offsite/', '_blank');
              }}
            >
              <Share className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BuildInPublicGenerator; 