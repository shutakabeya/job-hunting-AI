export interface Agent {
  role: string;
  goal: string;
  backstory: string;
  allowedTools: string[];
}

export interface Task {
  id: string;
  type: 'research' | 'es' | 'interview' | 'skill' | 'networking';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  deadline?: Date;
  guidance: {
    whatToLearn: string[];
    howToPrepare: string[];
    tips: string[];
  };
}

export interface AnalysisResult {
  values: string[];
  strengths: string[];
  preferences: string[];
  summary: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
}

export interface CompanyMatch {
  company: Company;
  matchScore: number;
  matchingPoints: string[];
  challengePoints: string[];
}

export interface PreparationStrategy {
  companyId: string;
  companyName: string;
  focusPoints: string[];
  tasks: Task[];
} 