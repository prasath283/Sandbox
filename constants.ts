
import type { Analysis, IOC, ProcessEvent, ThreatIntel } from './types';
import { ThreatLevel } from './types';

export const mockIocs: IOC[] = [
  { id: 'ioc1', type: 'domain', value: 'malicious-c2.evil.net', timestamp: '2.1s', malicious: true },
  { id: 'ioc2', type: 'ip', value: '198.51.100.123', timestamp: '3.5s', malicious: true },
  { id: 'ioc3', type: 'hash', value: 'e3b0c44298fc1c149afbf4c8...', timestamp: '5.2s', malicious: true },
];

export const mockProcessTree: ProcessEvent[] = [
  {
    id: 'p1', pid: 1234, processName: 'winword.exe', commandLine: 'winword.exe /q FinancialReport.docm', timestamp: '0.5s',
    children: [
      {
        id: 'p2', pid: 5678, processName: 'powershell.exe', commandLine: '-enc JABjAGwAaQBlAG4Ad...', timestamp: '1.8s',
        children: [
          { id: 'p3', pid: 9101, processName: 'rundll32.exe', commandLine: 'rundll32.exe malicious.dll,Entry', timestamp: '4.1s' }
        ]
      }
    ]
  },
  { id: 'p4', pid: 2345, processName: 'explorer.exe', commandLine: 'C:\\Windows\\explorer.exe', timestamp: '0.1s' }
];

export const mockThreatIntel: ThreatIntel[] = [
  { source: 'VirusTotal', correlation: 'Detected as Trojan.GenericKD.33924719', reference: '#' },
  { source: 'Internal Intel', correlation: 'Affiliated with Lazarus Group APT (Campaign "Operation AppleJeus")', reference: '#' }
];

export const mockYaraRule = `rule Lazarus_Doc_Downloader {
  meta:
    description = "Detects encoded PowerShell downloader used in Lazarus campaign"
    author = "Cerebrum AI"
  strings:
    $ps_encoded = "powershell.exe -enc" wide ascii
    $c2_domain = "malicious-c2.evil.net" wide ascii
  condition:
    all of them
}`;

export const mockAnalyses: Analysis[] = [
  {
    id: '1',
    fileName: 'FinancialReport_Q3.docm',
    fileHash: 'a1b2c3d4e5f6...',
    submittedAt: '2024-07-29T10:30:00Z',
    status: 'Completed',
    threatScore: 92,
    threatLevel: ThreatLevel.Critical,
    summary: 'Macro-enabled document executed encoded PowerShell to download a second-stage payload. Communicated with a known C2 server associated with Lazarus Group.',
    os: 'Windows',
    architecture: 'x86',
    iocs: mockIocs,
    processTree: mockProcessTree,
    threatIntel: mockThreatIntel,
    yaraRule: mockYaraRule,
  },
  {
    id: '2',
    fileName: 'installer.pkg',
    fileHash: 'f6e5d4c3b2a1...',
    submittedAt: '2024-07-29T10:25:00Z',
    status: 'Completed',
    threatScore: 78,
    threatLevel: ThreatLevel.Malicious,
    summary: 'Unsigned macOS installer attempted to establish persistence via a LaunchAgent and exfiltrate keychain data.',
    os: 'macOS',
    architecture: 'ARM',
    iocs: [{ id: 'ioc4', type: 'url', value: 'https://data-exfil.xyz/upload', timestamp: '8.1s', malicious: true }],
    processTree: [{id: 'p5', pid: 4431, processName: 'installer', commandLine: '...', timestamp: '1.2s'}],
  },
  {
    id: '3',
    fileName: 'login_update.sh',
    fileHash: 'b2c1d4a3e5f6...',
    submittedAt: '2024-07-29T10:15:00Z',
    status: 'Completed',
    threatScore: 45,
    threatLevel: ThreatLevel.Suspicious,
    summary: 'Shell script contains obfuscated commands that attempt to curl a remote file and execute it. The remote host is currently offline.',
    os: 'Linux',
    architecture: 'x86'
  },
  {
    id: '4',
    fileName: 'clean_utility.exe',
    fileHash: 'c3d4e5f6a1b2...',
    submittedAt: '2024-07-29T09:50:00Z',
    status: 'Completed',
    threatScore: 5,
    threatLevel: ThreatLevel.Benign,
    summary: 'Signed executable from a trusted publisher. No malicious or suspicious behavior observed during analysis.',
    os: 'Windows',
    architecture: 'x86'
  }
];
