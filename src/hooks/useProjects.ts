
import { useState } from 'react';

export interface Project {
  id: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Complete Skills Assessment',
      status: 'done',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Research Target Companies',
      status: 'in-progress',
      priority: 'high'
    },
    {
      id: '3',
      title: 'Update LinkedIn Profile',
      status: 'in-progress',
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Practice Interview Questions',
      status: 'backlog',
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Build Portfolio Website',
      status: 'backlog',
      priority: 'low'
    }
  ]);

  const moveProject = (projectId: string, newStatus: Project['status']) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, status: newStatus }
          : project
      )
    );
  };

  const addProject = (title: string, priority: Project['priority']) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      status: 'backlog',
      priority
    };
    setProjects(prev => [...prev, newProject]);
  };

  return {
    projects,
    moveProject,
    addProject
  };
};
