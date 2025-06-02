
import { useState } from 'react';

export interface PhaseData {
  id: string;
  title: string;
  description: string;
  progress: number;
  color: string;
}

export const useDashboard = () => {
  const [phases] = useState<PhaseData[]>([
    {
      id: 'introspection',
      title: 'Introspection',
      description: 'Self-discovery and understanding your values, interests, and strengths',
      progress: 75,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'exploration',
      title: 'Exploration',
      description: 'Research career paths, industries, and opportunities',
      progress: 45,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'reflection',
      title: 'Reflection',
      description: 'Analyze experiences and insights to make informed decisions',
      progress: 30,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'action',
      title: 'Action',
      description: 'Execute your career plan and take concrete steps forward',
      progress: 15,
      color: 'from-orange-500 to-red-500'
    }
  ]);

  return { phases };
};
