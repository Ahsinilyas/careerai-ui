
import { useState } from 'react';

export interface CompanyAlert {
  id: string;
  companyName: string;
  lastJobLink: string;
  lastSeen: Date;
  notifications: boolean;
}

export const useAlerts = () => {
  const [companies, setCompanies] = useState<CompanyAlert[]>([
    {
      id: '1',
      companyName: 'Google',
      lastJobLink: 'https://careers.google.com/jobs/software-engineer',
      lastSeen: new Date('2024-05-30'),
      notifications: true
    },
    {
      id: '2',
      companyName: 'Microsoft',
      lastJobLink: 'https://careers.microsoft.com/jobs/product-manager',
      lastSeen: new Date('2024-05-29'),
      notifications: true
    },
    {
      id: '3',
      companyName: 'Apple',
      lastJobLink: 'https://jobs.apple.com/jobs/design-engineer',
      lastSeen: new Date('2024-05-28'),
      notifications: false
    }
  ]);

  const toggleNotifications = (companyId: string) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === companyId
          ? { ...company, notifications: !company.notifications }
          : company
      )
    );
  };

  const addCompany = (companyName: string, jobLink: string) => {
    const newCompany: CompanyAlert = {
      id: Date.now().toString(),
      companyName,
      lastJobLink: jobLink,
      lastSeen: new Date(),
      notifications: true
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  return {
    companies,
    toggleNotifications,
    addCompany
  };
};
