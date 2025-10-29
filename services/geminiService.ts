
import { GoogleGenAI } from "@google/genai";
import type { NlpResponse, Analysis } from '../types';
import { mockAnalyses, mockYaraRule } from '../constants';

// This is a MOCK service. In a real application, you would implement actual API calls.
// We are simulating the expected behavior of the Gemini API.

class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // In a real app, the API key would be securely managed.
    // Here we conditionally initialize it if the env var is present,
    // but the mock methods will work without it.
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  // Simulates processing a natural language query
  async processNlpQuery(query: string): Promise<NlpResponse> {
    console.log(`Processing NLP query (mock): "${query}"`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Simple mock logic: filter analyses based on keywords
    const lowerCaseQuery = query.toLowerCase();
    let filteredAnalyses = mockAnalyses;

    if (lowerCaseQuery.includes('ransomware') || (lowerCaseQuery.includes('critical') && lowerCaseQuery.includes('threat'))) {
      filteredAnalyses = mockAnalyses.filter(a => a.threatScore > 90);
    } else if (lowerCaseQuery.includes('macos')) {
      filteredAnalyses = mockAnalyses.filter(a => a.os === 'macOS');
    } else if (lowerCaseQuery.includes('suspicious')) {
        filteredAnalyses = mockAnalyses.filter(a => a.threatLevel === 'Suspicious');
    }

    const summary = `Found ${filteredAnalyses.length} results matching your query for "${query}". Displaying the most relevant findings.`;

    return { query, results: filteredAnalyses, summary };
  }

  // Simulates generating a YARA rule based on analysis data
  async generateYaraRule(analysis: Analysis): Promise<string> {
    console.log(`Generating YARA rule for (mock): "${analysis.fileName}"`);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real scenario, you'd send a prompt with analysis details.
    // Here, we return a pre-defined mock rule if it's the critical threat.
    if (analysis.id === '1') {
      return mockYaraRule;
    }
    
    return `rule Generic_Detection_${analysis.fileName.split('.')[0]} {
  meta:
    description = "Generic rule for ${analysis.fileName}"
    author = "Cerebrum AI"
  strings:
    $file_hash = "${analysis.fileHash}"
  condition:
    $file_hash at 0
}`;
  }
}

export const geminiService = new GeminiService();
