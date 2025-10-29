
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import type { NlpResponse, Analysis } from '../types';
import { Card } from './ui/Card';
import { PaperAirplaneIcon, SparklesIcon, XMarkIcon } from './icons/Icons';
import { ThreatLevel } from '../types';


const NlpResult: React.FC<{ result: Analysis }> = ({ result }) => {
    const levelColor = {
        [ThreatLevel.Critical]: 'border-brand-danger',
        [ThreatLevel.Malicious]: 'border-orange-400',
        [ThreatLevel.Suspicious]: 'border-brand-warning',
        [ThreatLevel.Benign]: 'border-brand-success',
    };
    return (
        <div className={`p-3 border-l-4 ${levelColor[result.threatLevel]} bg-brand-surface/50 rounded-r-md`}>
            <p className="font-semibold text-brand-text-light text-sm">{result.fileName}</p>
            <p className="text-xs text-brand-text-dark font-mono">{result.fileHash}</p>
            <p className="text-xs text-brand-text-dark mt-1">{result.summary}</p>
        </div>
    );
}


export const NlpQuery: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<NlpResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);
    const res = await geminiService.processNlpQuery(query);
    setResponse(res);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-primary h-14 w-14 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-transform hover:scale-110"
      >
        <SparklesIcon className="w-7 h-7 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:max-w-md z-20">
      <Card className="flex flex-col h-[60vh] rounded-b-none sm:rounded-lg shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-brand-border">
          <h3 className="text-lg font-semibold flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-brand-primary" /> Natural Language Query</h3>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-brand-border">
            <XMarkIcon className="w-5 h-5 text-brand-text-dark" />
          </button>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {!response && !isLoading && (
                 <div className="text-center text-brand-text-dark text-sm pt-8">
                    <p>Ask anything about your analysis data.</p>
                    <p className="mt-4 font-semibold">Examples:</p>
                    <ul className="mt-1 text-xs">
                        <li>"Show me critical threats from today"</li>
                        <li>"Any suspicious macOS files?"</li>
                        <li>"List all ransomware activity"</li>
                    </ul>
                </div>
            )}
            {isLoading && (
                 <div className="flex items-center justify-center pt-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                </div>
            )}
            {response && (
                <div className="space-y-3">
                    <p className="text-sm text-brand-text-dark italic">Query: "{response.query}"</p>
                    <p className="text-sm text-brand-text-light">{response.summary}</p>
                    <div className="space-y-2">
                        {response.results.map(res => <NlpResult key={res.id} result={res} />)}
                    </div>
                </div>
            )}
        </div>
        
        <div className="p-4 border-t border-brand-border">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'Show me ransomware...'"
              className="flex-grow bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-sm text-brand-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button type="submit" disabled={isLoading} className="bg-brand-primary p-2 rounded-md text-white hover:bg-indigo-500 disabled:bg-gray-500">
                <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};
