
import React, { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { Plus, ExternalLink, Bell, BellOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Switch } from './ui/switch';

const Alerts: React.FC = () => {
  const { companies, toggleNotifications, addCompany } = useAlerts();
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newJobLink, setNewJobLink] = useState('');

  const handleAddCompany = () => {
    if (newCompanyName.trim() && newJobLink.trim()) {
      addCompany(newCompanyName, newJobLink);
      setNewCompanyName('');
      setNewJobLink('');
      setIsAddingCompany(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Job Alerts</h2>
          <p className="text-gray-600">Track job opportunities at your target companies</p>
        </div>
        <Button 
          onClick={() => setIsAddingCompany(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Add Company Form */}
      {isAddingCompany && (
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <Input
                placeholder="e.g., Google, Microsoft, Apple..."
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latest Job Link
              </label>
              <Input
                placeholder="https://..."
                value={newJobLink}
                onChange={(e) => setNewJobLink(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingCompany(false);
                  setNewCompanyName('');
                  setNewJobLink('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCompany}>
                Add Company
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Companies Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold text-gray-900">Company</th>
                <th className="text-left p-4 font-semibold text-gray-900">Last Job Link</th>
                <th className="text-left p-4 font-semibold text-gray-900">Last Seen</th>
                <th className="text-left p-4 font-semibold text-gray-900">Notifications</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {company.companyName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{company.companyName}</div>
                        <div className="text-sm text-gray-500">Technology Company</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <a
                      href={company.lastJobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span className="truncate max-w-xs">View latest job</span>
                      <ExternalLink className="w-4 h-4 ml-1 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(company.lastSeen)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={company.notifications}
                        onCheckedChange={() => toggleNotifications(company.id)}
                      />
                      {company.notifications ? (
                        <Bell className="w-4 h-4 text-green-600" />
                      ) : (
                        <BellOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {companies.length === 0 && !isAddingCompany && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No company alerts yet</h3>
          <p className="text-gray-500 mb-4">Start tracking job opportunities at your target companies</p>
          <Button onClick={() => setIsAddingCompany(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add your first company
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
          <div className="text-sm text-gray-600">Companies Tracked</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {companies.filter(c => c.notifications).length}
          </div>
          <div className="text-sm text-gray-600">Active Alerts</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {companies.filter(c => {
              const daysDiff = Math.floor((new Date().getTime() - c.lastSeen.getTime()) / (1000 * 3600 * 24));
              return daysDiff <= 7;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Recent Updates</div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
