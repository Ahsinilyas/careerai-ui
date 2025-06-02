
import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import PhaseCard from './PhaseCard';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { phases } = useDashboard();

  const stats = [
    { label: 'Days Active', value: '28', icon: Calendar, color: 'text-blue-600' },
    { label: 'Goals Completed', value: '12', icon: Target, color: 'text-green-600' },
    { label: 'Growth Score', value: '85%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Achievements', value: '5', icon: Award, color: 'text-orange-600' },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Track your career development journey across four key phases.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phase Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Development Phases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase) => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Completed skills assessment', time: '2 hours ago', type: 'completion' },
            { action: 'Added journal entry', time: '1 day ago', type: 'journal' },
            { action: 'Updated project status', time: '2 days ago', type: 'project' },
            { action: 'Set up company alert', time: '3 days ago', type: 'alert' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'completion' ? 'bg-green-500' :
                activity.type === 'journal' ? 'bg-blue-500' :
                activity.type === 'project' ? 'bg-purple-500' : 'bg-orange-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
