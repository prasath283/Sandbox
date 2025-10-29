
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { AnalysisReport } from './components/AnalysisReport';
import { NlpQuery } from './components/NlpQuery';
import { mockAnalyses } from './constants';
import type { Analysis } from './types';

const App: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  const handleSelectAnalysis = useCallback((analysis: Analysis) => {
    setSelectedAnalysis(analysis);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setSelectedAnalysis(null);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Header onBack={selectedAnalysis ? handleBackToDashboard : undefined} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {selectedAnalysis ? (
          <AnalysisReport analysis={selectedAnalysis} />
        ) : (
          <Dashboard onSelectAnalysis={handleSelectAnalysis} analyses={mockAnalyses} />
        )}
      </main>
      <NlpQuery />
    </div>
  );
};

export default App;
