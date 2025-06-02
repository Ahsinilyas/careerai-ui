
import React from 'react';
import { Home, BookOpen, FolderOpen, Bell, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CareerAI
          </h1>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onPageChange(item.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200",
                      isActive 
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-blue-700" : "text-gray-400")} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            CareerAI v1.0
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
