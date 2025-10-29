
import React from 'react';
import type { Analysis } from '../types';
import { ThreatLevel } from '../types';
import { Card } from './ui/Card';
import { UploadCloudIcon, AlertTriangleIcon, ShieldCheckIcon, ClockIcon } from './icons/Icons';

interface DashboardProps {
  analyses: Analysis[];
  onSelectAnalysis: (analysis: Analysis) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <Card className="p-4 flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-brand-text-dark">{label}</p>
      <p className="text-2xl font-bold text-brand-text-light">{value}</p>
    </div>
  </Card>
);

const ThreatRow: React.FC<{ analysis: Analysis; onSelect: (analysis: Analysis) => void }> = ({ analysis, onSelect }) => {
  const levelColor = {
    [ThreatLevel.Critical]: 'bg-red-500',
    [ThreatLevel.Malicious]: 'bg-orange-500',
    [ThreatLevel.Suspicious]: 'bg-yellow-500',
    [ThreatLevel.Benign]: 'bg-green-500',
  };

  return (
    <tr onClick={() => onSelect(analysis)} className="hover:bg-brand-surface cursor-pointer border-b border-brand-border last:border-b-0">
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center">
            <div className={`w-2.5 h-2.5 rounded-full mr-3 ${levelColor[analysis.threatLevel]}`}></div>
            <div>
              <div className="font-medium text-brand-text-light">{analysis.fileName}</div>
              <div className="text-xs text-brand-text-dark font-mono">{analysis.fileHash}</div>
            </div>
        </div>
      </td>
      <td className="p-4 whitespace-nowrap text-sm text-brand-text-dark">{new Date(analysis.submittedAt).toLocaleString()}</td>
      <td className="p-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${levelColor[analysis.threatLevel]
          } bg-opacity-20 ${levelColor[analysis.threatLevel].replace('bg', 'text')}`}>
          {analysis.threatLevel}
        </span>
      </td>
      <td className="p-4 whitespace-nowrap text-right text-sm font-medium">{analysis.threatScore}</td>
    </tr>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ analyses, onSelectAnalysis }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<ClockIcon className="w-6 h-6 text-blue-300" />} label="Analyzed (24h)" value="1,204" color="bg-blue-500/20" />
        <StatCard icon={<AlertTriangleIcon className="w-6 h-6 text-red-300" />} label="Critical Threats" value="18" color="bg-red-500/20" />
        <StatCard icon={<ShieldCheckIcon className="w-6 h-6 text-green-300" />} label="Benign Files" value="982" color="bg-green-500/20" />
        <StatCard icon={<UploadCloudIcon className="w-6 h-6 text-indigo-300" />} label="In Queue" value="7" color="bg-indigo-500/20" />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-6">
            <h2 className="text-lg font-semibold text-brand-text-light">Submit File for Analysis</h2>
            <p className="text-sm text-brand-text-dark mt-1">Upload a file to the Chameleon Core for dynamic analysis.</p>
        </div>
        <div className="px-6 pb-6">
            <div className="border-2 border-dashed border-brand-border rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <UploadCloudIcon className="w-12 h-12 text-brand-text-dark" />
                <p className="mt-4 text-brand-text-light">Drag & drop files here or click to browse</p>
                <p className="text-xs text-brand-text-dark mt-1">Max file size: 100MB</p>
                <button className="mt-4 bg-brand-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-500 transition-colors">
                    Browse Files
                </button>
            </div>
        </div>
      </Card>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-brand-border">
          <h2 className="text-lg font-semibold text-brand-text-light">Recent Threats</h2>
          <p className="text-sm text-brand-text-dark mt-1">Overview of the latest high-priority analysis results.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-brand-surface">
              <tr>
                <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-dark uppercase tracking-wider">File</th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-dark uppercase tracking-wider">Submitted</th>
                <th scope="col" className="p-4 text-left text-xs font-medium text-brand-text-dark uppercase tracking-wider">Threat Level</th>
                <th scope="col" className="p-4 text-right text-xs font-medium text-brand-text-dark uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="bg-brand-bg divide-y divide-brand-border">
              {analyses.map(analysis => (
                <ThreatRow key={analysis.id} analysis={analysis} onSelect={onSelectAnalysis} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
