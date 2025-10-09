// src/types/workspace.types.ts

export type WorkspaceTab = 'explanation' | 'flowchart' | 'chat' | 'tests';

export interface WorkspaceState {
  // Code & Editor
  code: string;
  language: string;
  hasUnsavedChanges: boolean;
  
  // AI Analysis
  isAnalyzing: boolean;
  lastAnalysis: Date | null;
  
  // Progress
  progressPercentage: number;
  timeSpent: number; // in seconds
  
  // Active Tab
  activeTab: WorkspaceTab;
  
  // Test Results
  testResults: TestResult[] | null;
  
  // AI Content
  explanation: ExplanationData | null;
  flowchart: FlowchartData | null;
  chatHistory: ChatMessage[];
}

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

export interface ExplanationData {
  summary: string;
  keyConcepts: string[];
  estimatedTime: number; // in minutes
  prerequisites: string[];
  roadmap: RoadmapStep[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface FlowchartData {
  mermaidCode: string;
  nodes: FlowchartNode[];
  generatedAt: Date;
}

export interface FlowchartNode {
  id: string;
  label: string;
  description: string;
  type: 'start' | 'process' | 'decision' | 'end';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
}

export interface WorkspaceActions {
  checkProgress: () => Promise<void>;
  runTests: () => Promise<void>;
  resetCode: () => void;
  viewSolution: () => void;
  saveSnapshot: () => void;
  submitSolution: () => Promise<void>;
}