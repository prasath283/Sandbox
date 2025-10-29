
export enum ThreatLevel {
  Benign = 'Benign',
  Suspicious = 'Suspicious',
  Malicious = 'Malicious',
  Critical = 'Critical',
}

export interface IOC {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  value: string;
  timestamp: string;
  malicious: boolean;
}

export interface ProcessEvent {
  id: string;
  pid: number;
  processName: string;
  commandLine: string;
  timestamp: string;
  children?: ProcessEvent[];
}

export interface ThreatIntel {
  source: string;
  correlation: string;
  reference: string;
}

export interface Analysis {
  id: string;
  fileName: string;
  fileHash: string;
  submittedAt: string;
  status: 'Completed' | 'In Progress' | 'Queued';
  threatScore: number;
  threatLevel: ThreatLevel;
  summary: string;
  os: 'Windows' | 'Linux' | 'macOS';
  architecture: 'x86' | 'ARM';
  iocs?: IOC[];
  processTree?: ProcessEvent[];
  threatIntel?: ThreatIntel[];
  yaraRule?: string;
}

export interface NlpResponse {
  query: string;
  results: Analysis[];
  summary: string;
}
