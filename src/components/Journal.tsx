import React, { useState } from 'react';
import { useJournal } from '../hooks/useJournal';
import { Plus, FileText, Sparkles, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import IkigaiAnalysis from './IkigaiAnalysis';
import BuildInPublicGenerator from './BuildInPublicGenerator';

const Journal: React.FC = () => {
  const { 
    entries, 
    currentEntry, 
    setCurrentEntry, 
    addEntry, 
    generateAISummary,
    ikigaiResult,
    isAnalyzing,
    generateIkigaiAnalysis
  } = useJournal();
  const [isWriting, setIsWriting] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);

  const handleSaveEntry = () => {
    if (entryTitle.trim() && currentEntry.trim()) {
      addEntry(entryTitle, currentEntry);
      setEntryTitle('');
      setIsWriting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGeneratePost = async () => {
    try {
      setIsGeneratingPost(true);
      const response = await fetch('http://localhost:3001/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ikigaiData: ikigaiResult })
      });

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const post = await response.json();
      return post;
    } catch (error) {
      console.error('Error generating post:', error);
      throw error;
    } finally {
      setIsGeneratingPost(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Journal</h2>
          <p className="text-gray-600">Capture your thoughts and career insights</p>
        </div>
        <Button 
          onClick={() => setIsWriting(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* IKIGAI Analysis */}
      <div className="mb-6">
        <IkigaiAnalysis
          journalEntries={entries}
          onAnalyze={generateIkigaiAnalysis}
          isAnalyzing={isAnalyzing}
          result={ikigaiResult}
        />
      </div>

      {/* Build in Public Generator */}
      <div className="mb-6">
        <BuildInPublicGenerator
          ikigaiData={ikigaiResult}
          onGenerate={handleGeneratePost}
          isGenerating={isGeneratingPost}
        />
      </div>

      {/* Writing Interface */}
      {isWriting && (
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <Input
              placeholder="Entry title..."
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="text-lg font-semibold"
            />
            <Textarea
              placeholder="What's on your mind? Share your career thoughts, insights, or reflections..."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsWriting(false);
                  setEntryTitle('');
                  setCurrentEntry('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEntry}>
                Save Entry
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(entry.date)}
                  </div>
                </div>
              </div>
              {!entry.aiSummary && (
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateAISummary(entry.id)}
                    disabled={entry.isGeneratingSummary}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {entry.isGeneratingSummary ? 'Generating...' : 'Get AI Summary'}
                  </Button>
                  {entry.error && (
                    <p className="text-sm text-red-500">{entry.error}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none mb-4">
              <p className="text-gray-700 leading-relaxed">
                {entry.content.length > 200 
                  ? `${entry.content.substring(0, 200)}...` 
                  : entry.content
                }
              </p>
            </div>

            {entry.aiSummary && (
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">AI Summary</span>
                </div>
                <p className="text-sm text-purple-700">{entry.aiSummary}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {entries.length === 0 && !isWriting && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No journal entries yet</h3>
          <p className="text-gray-500 mb-4">Start documenting your career journey</p>
          <Button onClick={() => setIsWriting(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Write your first entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default Journal;
