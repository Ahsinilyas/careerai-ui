
import React, { useState } from 'react';
import { useProjects, Project } from '../hooks/useProjects';
import { Plus, Circle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';

const Projects: React.FC = () => {
  const { projects, moveProject, addProject } = useProjects();
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState<Project['priority']>('medium');

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'border-gray-200' },
    { id: 'in-progress', title: 'In Progress', color: 'border-blue-200' },
    { id: 'done', title: 'Done', color: 'border-green-200' }
  ] as const;

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const handleAddProject = () => {
    if (newProjectTitle.trim()) {
      addProject(newProjectTitle, newProjectPriority);
      setNewProjectTitle('');
      setIsAddingProject(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.setData('text/plain', projectId);
  };

  const handleDrop = (e: React.DragEvent, status: Project['status']) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    moveProject(projectId, status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your career development milestones</p>
        </div>
        <Button 
          onClick={() => setIsAddingProject(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Add Project Form */}
      {isAddingProject && (
        <Card className="p-4 mb-6">
          <div className="space-y-3">
            <Input
              placeholder="Project title..."
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
            />
            <Select value={newProjectPriority} onValueChange={(value: Project['priority']) => setNewProjectPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingProject(false);
                  setNewProjectTitle('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProject}>
                Add Project
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn("border-2 border-dashed rounded-lg p-4 min-h-[400px]", column.color)}
            onDrop={(e) => handleDrop(e, column.id as Project['status'])}
            onDragOver={handleDragOver}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {projects.filter(p => p.status === column.id).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {projects
                .filter(project => project.status === column.id)
                .map((project) => (
                  <Card
                    key={project.id}
                    className="p-4 cursor-move hover:shadow-md transition-shadow duration-200"
                    draggable
                    onDragStart={(e) => handleDragStart(e, project.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Circle className={cn("w-3 h-3 fill-current", getPriorityColor(project.priority))} />
                          <span className="text-xs text-gray-500 capitalize">{project.priority} priority</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'backlog').length}</div>
          <div className="text-sm text-gray-600">In Backlog</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{projects.filter(p => p.status === 'in-progress').length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{projects.filter(p => p.status === 'done').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
      </div>
    </div>
  );
};

export default Projects;
