import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, Search, Send } from 'lucide-react';

interface IkigaiResult {
  passion: string[];
  mission: string[];
  profession: string[];
  vocation: string[];
  recommendedRoles: string[];
  recommendedCompanies: string[];
}

interface IkigaiAnalysisProps {
  journalEntries: any[];
  onAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
  result?: IkigaiResult;
}

const IkigaiAnalysis: React.FC<IkigaiAnalysisProps> = ({
  journalEntries,
  onAnalyze,
  isAnalyzing,
  result
}) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">IKIGAI Analysis</h3>
            <p className="text-sm text-gray-600">
              Analyze your journal entries to discover your IKIGAI and career alignment
            </p>
          </div>
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || journalEntries.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Entries'}
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            {/* IKIGAI Components */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-pink-50">
                <h4 className="font-semibold text-pink-700 mb-2">What you LOVE (Passion)</h4>
                <ul className="list-disc list-inside text-sm text-pink-600">
                  {result.passion.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-4 bg-blue-50">
                <h4 className="font-semibold text-blue-700 mb-2">What the World NEEDS (Mission)</h4>
                <ul className="list-disc list-inside text-sm text-blue-600">
                  {result.mission.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-4 bg-green-50">
                <h4 className="font-semibold text-green-700 mb-2">What you're GOOD AT (Profession)</h4>
                <ul className="list-disc list-inside text-sm text-green-600">
                  {result.profession.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>
              
              <Card className="p-4 bg-orange-50">
                <h4 className="font-semibold text-orange-700 mb-2">What you can be PAID FOR (Vocation)</h4>
                <ul className="list-disc list-inside text-sm text-orange-600">
                  {result.vocation.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Career Recommendations */}
            <div className="space-y-4">
              <Card className="p-4 bg-purple-50">
                <div className="flex items-center mb-3">
                  <Search className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-purple-700">Recommended Roles</h4>
                </div>
                <ul className="list-disc list-inside text-sm text-purple-600">
                  {result.recommendedRoles.map((role, i) => (
                    <li key={i}>{role}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4 bg-indigo-50">
                <div className="flex items-center mb-3">
                  <Send className="w-5 h-5 text-indigo-600 mr-2" />
                  <h4 className="font-semibold text-indigo-700">Recommended Companies & Outreach</h4>
                </div>
                <ul className="list-disc list-inside text-sm text-indigo-600">
                  {result.recommendedCompanies.map((company, i) => (
                    <li key={i}>{company}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {!result && !isAnalyzing && journalEntries.length > 0 && (
          <p className="text-sm text-gray-600">
            Click "Analyze Entries" to generate your IKIGAI analysis and career recommendations
          </p>
        )}

        {journalEntries.length === 0 && (
          <p className="text-sm text-gray-600">
            Add some journal entries to get started with your IKIGAI analysis
          </p>
        )}
      </Card>
    </div>
  );
};

export default IkigaiAnalysis; 