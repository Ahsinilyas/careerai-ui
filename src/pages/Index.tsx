
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Journal from '../components/Journal';
import Projects from '../components/Projects';
import Alerts from '../components/Alerts';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageComponents = {
    dashboard: Dashboard,
    journal: Journal,
    projects: Projects,
    alerts: Alerts,
  };

  const pageTitles = {
    dashboard: 'Dashboard',
    journal: 'Journal',
    projects: 'Projects',
    alerts: 'Job Alerts',
  };

  const CurrentPageComponent = pageComponents[currentPage as keyof typeof pageComponents];

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header
          title={pageTitles[currentPage as keyof typeof pageTitles]}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-auto">
          <CurrentPageComponent />
        </main>
      </div>
    </div>
  );
};

export default Index;
