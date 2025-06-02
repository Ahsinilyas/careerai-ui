
import { useState } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  aiSummary?: string;
}

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      title: 'First Week Reflections',
      content: 'Today I started thinking about my career goals and what really motivates me...',
      date: new Date('2024-05-28'),
      aiSummary: 'Initial career exploration focusing on personal motivation and goal setting.'
    },
    {
      id: '2',
      title: 'Industry Research',
      content: 'Spent time researching the tech industry and different roles that might fit my skills...',
      date: new Date('2024-05-30'),
    }
  ]);

  const [currentEntry, setCurrentEntry] = useState('');

  const addEntry = (title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date(),
    };
    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry('');
  };

  const generateAISummary = async (entryId: string) => {
    // Simulate AI summary generation
    const summary = 'AI-generated summary of key insights and themes from this journal entry.';
    setEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, aiSummary: summary }
          : entry
      )
    );
  };

  return {
    entries,
    currentEntry,
    setCurrentEntry,
    addEntry,
    generateAISummary
  };
};
