
import React from 'react';
import { PhaseData } from '../hooks/useDashboard';
import ProgressRing from './ProgressRing';

interface PhaseCardProps {
  phase: PhaseData;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${phase.color} p-6 text-white shadow-lg transition-transform duration-300 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
          <p className="text-sm opacity-90 mb-4">{phase.description}</p>
          <div className="text-xs opacity-75">
            Progress: {phase.progress}% complete
          </div>
        </div>
        <div className="ml-4">
          <ProgressRing progress={phase.progress} size={100} strokeWidth={6} />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
    </div>
  );
};

export default PhaseCard;
