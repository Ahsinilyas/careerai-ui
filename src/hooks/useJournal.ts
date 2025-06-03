import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  aiSummary?: string;
  isGeneratingSummary?: boolean;
  error?: string;
}

export interface IkigaiResult {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
  recommendedRoles: string[];
  recommendedCompanies: string[];
}

const BASE_URL = "http://localhost:3001/api";

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [ikigaiResult, setIkigaiResult] = useState<IkigaiResult | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/journal`);
        const data = await response.json();
        setEntries(data.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        })));
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const addEntry = async (title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date(),
    };

    try {
      const response = await fetch(`${BASE_URL}/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry)
      });

      const savedEntry = await response.json();
      setEntries(prev => [{ ...savedEntry, date: new Date(savedEntry.date) }, ...prev]);
      setCurrentEntry('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const generateIkigaiAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setIkigaiResult(undefined);

      const response = await fetch(`${BASE_URL}/ikigai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries })
      });

      if (!response.ok) {
        throw new Error('Failed to generate IKIGAI analysis');
      }

      const result = await response.json();
      setIkigaiResult(result);
    } catch (error) {
      console.error('Error generating IKIGAI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAISummary = async (entryId: string) => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) return;

      // Set loading state
      setEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, isGeneratingSummary: true, error: undefined }
            : entry
        )
      );

      const response = await fetch('http://localhost:3001/api/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: entry.content })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate summary');
      }
      
      setEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, aiSummary: data.summary, isGeneratingSummary: false, error: undefined }
            : entry
        )
      );
    } catch (error) {
      console.error('Error generating AI summary:', error);
      // Set error state
      setEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, isGeneratingSummary: false, error: error.message }
            : entry
        )
      );
    }
  };

  return {
    entries,
    currentEntry,
    setCurrentEntry,
    addEntry,
    generateAISummary,
    isLoading,
    ikigaiResult,
    isAnalyzing,
    generateIkigaiAnalysis
  };
};
