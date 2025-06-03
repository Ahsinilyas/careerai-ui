import React from 'react';
import { Button } from './ui/button';
import { PhaseData } from '../hooks/useDashboard';

interface PhaseCardProps {
  phase: PhaseData;
  onProgressUpdate: (phaseId: string, increment: number) => Promise<void>;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, onProgressUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{phase.title}</h4>
          <p className="text-sm text-gray-600">{phase.description}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${phase.color} bg-opacity-10`}>
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="font-semibold text-white">{Math.round(phase.progress)}%</span>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${phase.color}`}
          style={{ width: `${phase.progress}%` }}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onProgressUpdate(phase.id, -10)}
          disabled={phase.progress <= 0}
        >
          -10%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onProgressUpdate(phase.id, 10)}
          disabled={phase.progress >= 100}
        >
          +10%
        </Button>
      </div>
    </div>
  );
};

export default PhaseCard;
