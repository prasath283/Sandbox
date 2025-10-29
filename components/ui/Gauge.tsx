
import React from 'react';
import { ThreatLevel } from '../../types';

interface GaugeProps {
  value: number; // 0-100
}

export const Gauge: React.FC<GaugeProps> = ({ value }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * 52; // 2 * pi * r
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  let colorClass = 'text-brand-success';
  let trackColorClass = 'stroke-brand-success';
  let level = ThreatLevel.Benign;

  if (clampedValue >= 40) {
    colorClass = 'text-brand-warning';
    trackColorClass = 'stroke-brand-warning';
    level = ThreatLevel.Suspicious;
  }
  if (clampedValue >= 70) {
    colorClass = 'text-orange-400';
    trackColorClass = 'stroke-orange-400';
    level = ThreatLevel.Malicious;
  }
  if (clampedValue >= 90) {
    colorClass = 'text-brand-danger';
    trackColorClass = 'stroke-brand-danger';
    level = ThreatLevel.Critical;
  }

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          className="stroke-current text-brand-border"
          cx="60"
          cy="60"
          r="52"
          strokeWidth="12"
          fill="transparent"
        />
        <circle
          className={`stroke-current ${trackColorClass} transition-all duration-500`}
          cx="60"
          cy="60"
          r="52"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${colorClass}`}>{clampedValue}</span>
        <span className={`text-xs font-semibold ${colorClass}`}>{level}</span>
      </div>
    </div>
  );
};
