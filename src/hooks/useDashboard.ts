import { useState, useEffect } from 'react';

export interface PhaseData {
  id: string;
  title: string;
  description: string;
  progress: number;
  color: string;
}

interface DashboardData {
  [key: string]: number;
}

const BASE_URL = "http://localhost:3001/api";

export const useDashboard = () => {
  const [phases, setPhases] = useState<PhaseData[]>([
    {
      id: 'introspection',
      title: 'Introspection',
      description: 'Self-discovery and understanding your values, interests, and strengths',
      progress: 0,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'exploration',
      title: 'Exploration',
      description: 'Research career paths, industries, and opportunities',
      progress: 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'reflection',
      title: 'Reflection',
      description: 'Analyze experiences and insights to make informed decisions',
      progress: 0,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'action',
      title: 'Action',
      description: 'Execute your career plan and take concrete steps forward',
      progress: 0,
      color: 'from-orange-500 to-red-500'
    }
  ]);

  const [stats, setStats] = useState({
    daysActive: 0,
    goalsCompleted: 0,
    growthScore: '0%',
    achievements: 0
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dashboard`);
        const data: DashboardData = await response.json();
        
        // Update phases with progress from server
        setPhases(prev => prev.map(phase => ({
          ...phase,
          progress: data[phase.id] || 0
        })));

        // Calculate stats
        const totalProgress: number = Object.values(data).reduce((sum, val) => sum + val, 0);
        const avgProgress: number = Math.round(totalProgress / 4);
        
        const daysSinceStart = Math.floor(
          (Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)
        );
        
        setStats({
          daysActive: daysSinceStart,
          goalsCompleted: Math.floor(totalProgress / 25), // 1 goal per 25% progress
          growthScore: `${avgProgress}%`,
          achievements: Math.floor(totalProgress / 50) // 1 achievement per 50% progress
        });
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };

    fetchDashboard();
  }, []);

  // Update phase progress
  const updateProgress = async (phaseId: string, increment: number) => {
    try {
      const phase = phases.find(p => p.id === phaseId);
      if (!phase) return;

      const newProgress = Math.min(100, Math.max(0, phase.progress + increment));
      
      const response = await fetch(`${BASE_URL}/dashboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [phaseId]: newProgress })
      });

      if (response.ok) {
        setPhases(prev => prev.map(p => 
          p.id === phaseId ? { ...p, progress: newProgress } : p
        ));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return { phases, stats, updateProgress };
};
