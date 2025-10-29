
import React from 'react';
import { BrainCircuitIcon, ChevronLeftIcon } from './icons/Icons';

interface HeaderProps {
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-full text-brand-text-dark hover:bg-brand-border hover:text-brand-text-light transition-colors"
                aria-label="Back to dashboard"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <BrainCircuitIcon className="h-8 w-8 text-brand-primary" />
              <h1 className="text-xl font-bold text-brand-text-light">Cerebrum Sandbox</h1>
            </div>
          </div>
          <div className="text-sm font-medium text-brand-secondary">
            Highly Evasive Adaptive Threat Analysis
          </div>
        </div>
      </div>
    </header>
  );
};
