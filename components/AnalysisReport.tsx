
import React, { useState, useEffect } from 'react';
import type { Analysis, IOC, ProcessEvent } from '../types';
import { ThreatLevel } from '../types';
import { Card } from './ui/Card';
import { Gauge } from './ui/Gauge';
import { geminiService } from '../services/geminiService';
import { AlertTriangleIcon, CheckCircleIcon, ChevronDownIcon, ChevronRightIcon, ClipboardCopyIcon, CpuChipIcon, FileCodeIcon, GlobeAltIcon, LinkIcon } from './icons/Icons';

interface AnalysisReportProps {
  analysis: Analysis;
}

const IOCList: React.FC<{ iocs: IOC[] }> = ({ iocs }) => (
  <div className="flow-root">
    <ul className="-my-4 divide-y divide-brand-border">
      {iocs.map(ioc => (
        <li key={ioc.id} className="flex items-center py-4 space-x-3">
          <div className={`p-1.5 rounded-full ${ioc.malicious ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
            {ioc.malicious ? <AlertTriangleIcon className="w-5 h-5 text-red-400" /> : <CheckCircleIcon className="w-5 h-5 text-green-400" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm text-brand-text-light truncate">{ioc.value}</p>
            <p className="text-xs text-brand-text-dark">{ioc.type.toUpperCase()} @ {ioc.timestamp}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const ProcessNode: React.FC<{ event: ProcessEvent; level: number }> = ({ event, level }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  return (
    <div>
      <div className="flex items-center py-2 hover:bg-brand-surface/50 rounded-md px-2">
        <div style={{ paddingLeft: `${level * 1.5}rem` }}>
          {event.children && event.children.length > 0 ? (
            <button onClick={() => setIsOpen(!isOpen)} className="mr-2 p-0.5 rounded-sm hover:bg-brand-border">
              {isOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
            </button>
          ) : <div className="w-5 inline-block" />}
          <span className="font-mono text-sm text-brand-text-light">{event.processName}</span>
          <span className="font-mono text-xs text-brand-text-dark ml-4 truncate">{event.commandLine}</span>
        </div>
      </div>
      {isOpen && event.children && (
        <div>
          {event.children.map(child => <ProcessNode key={child.id} event={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );
};


export const AnalysisReport: React.FC<AnalysisReportProps> = ({ analysis }) => {
  const [generatedRule, setGeneratedRule] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateRule = async () => {
    setIsGenerating(true);
    const rule = await geminiService.generateYaraRule(analysis);
    setGeneratedRule(rule);
    setIsGenerating(false);
  };
  
  const handleCopyRule = () => {
    if (generatedRule) {
      navigator.clipboard.writeText(generatedRule);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };


  const levelColor = {
    [ThreatLevel.Critical]: 'text-brand-danger',
    [ThreatLevel.Malicious]: 'text-orange-400',
    [ThreatLevel.Suspicious]: 'text-brand-warning',
    [ThreatLevel.Benign]: 'text-brand-success',
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-brand-text-light break-all">{analysis.fileName}</h1>
            <p className="font-mono text-sm text-brand-text-dark mt-1">{analysis.fileHash}</p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
                <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${levelColor[analysis.threatLevel]} bg-opacity-10 ${levelColor[analysis.threatLevel].replace('text-', 'bg-')}`}>{analysis.threatLevel}</span>
                <span>OS: {analysis.os}</span>
                <span>Arch: {analysis.architecture}</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Gauge value={analysis.threatScore} />
          </div>
        </div>
        <div className="mt-6 border-t border-brand-border pt-4">
            <h3 className="font-semibold text-brand-text-light">AI Summary</h3>
            <p className="text-sm text-brand-text-dark mt-2">{analysis.summary}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-brand-text-light flex items-center"><LinkIcon className="w-5 h-5 mr-2"/>Live IOC Extraction</h2>
          <div className="mt-4">
            {analysis.iocs && analysis.iocs.length > 0 ? <IOCList iocs={analysis.iocs} /> : <p className="text-sm text-brand-text-dark">No IOCs detected.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-brand-text-light flex items-center"><GlobeAltIcon className="w-5 h-5 mr-2"/>Threat Intelligence Correlation</h2>
          <div className="mt-4 space-y-3">
             {analysis.threatIntel && analysis.threatIntel.length > 0 ? analysis.threatIntel.map((intel, index) => (
               <div key={index}>
                  <p className="font-semibold text-sm text-brand-text-light">{intel.correlation}</p>
                  <p className="text-xs text-brand-text-dark">Source: {intel.source}</p>
               </div>
             )) : <p className="text-sm text-brand-text-dark">No threat intelligence correlations found.</p>}
          </div>
        </Card>
      </div>

      <Card>
          <h2 className="text-lg font-semibold text-brand-text-light flex items-center"><CpuChipIcon className="w-5 h-5 mr-2"/>Behavioral Analysis - Process Tree</h2>
          <div className="mt-4 bg-brand-bg p-2 rounded-lg">
            {analysis.processTree && analysis.processTree.length > 0 ? (
                analysis.processTree.map(pt => <ProcessNode key={pt.id} event={pt} level={0} />)
            ) : <p className="text-sm text-brand-text-dark p-4">No significant process activity recorded.</p>}
          </div>
      </Card>

       <Card>
          <h2 className="text-lg font-semibold text-brand-text-light flex items-center"><FileCodeIcon className="w-5 h-5 mr-2"/>Automated YARA Rule Generation</h2>
          <div className="mt-4">
            {!generatedRule && (
                <button onClick={handleGenerateRule} disabled={isGenerating} className="bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {isGenerating ? 'AI is thinking...' : 'Generate YARA Rule with AI'}
                </button>
            )}
            {generatedRule && (
                 <div className="bg-brand-bg p-4 rounded-lg font-mono text-sm text-brand-text-light relative">
                    <button onClick={handleCopyRule} className="absolute top-2 right-2 p-2 rounded-md bg-brand-border hover:bg-brand-surface transition-colors">
                       {copied ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <ClipboardCopyIcon className="w-5 h-5 text-brand-text-dark"/>}
                    </button>
                    <pre><code>{generatedRule}</code></pre>
                 </div>
            )}
          </div>
      </Card>
    </div>
  );
};
