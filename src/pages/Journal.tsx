import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Journal() {
  const [journalText, setJournalText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetAISummary = async () => {
    if (!journalText.trim()) {
      setError('Please write something in your journal first');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('Sending request to API:', { text: journalText });
      
      const res = await fetch("http://localhost:3001/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: journalText })
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`API error: ${errorData.error || res.status}`);
      }
      
      const data = await res.json();
      console.log('API response:', data);
      
      if (!data.summary) {
        throw new Error('No summary received from API');
      }
      
      setSummary(data.summary);
    } catch (err) {
      console.error('Summary error:', err);
      setError(err.message || 'Failed to get AI summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Journal</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Textarea
            placeholder="Write your thoughts here..."
            className="min-h-[200px] mb-4"
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleGetAISummary}
              disabled={isLoading || !journalText.trim()}
              className="w-fit"
            >
              {isLoading ? 'Getting AI Summary...' : 'Get AI Summary'}
            </Button>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-purple-500">✨</span>
              AI Summary
            </h2>
            <p className="text-purple-900">{summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 