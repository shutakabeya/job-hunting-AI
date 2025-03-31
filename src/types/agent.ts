export type Phase = 'self_analysis' | 'company_matching' | 'preparation';
export type UserGoal = 'explore' | 'find_best_fit' | 'prepare_application';

export interface StepProgress {
  completed: boolean;
  timestamp?: number;
  data?: any;
}

export interface JobHuntingState {
  phase: 'self_analysis' | 'company_matching' | 'preparation';
  progress: {
    self_analysis: {
      valuesAnalysis: StepProgress;
      careerAspirations: StepProgress;
      strengthsWeaknesses: StepProgress;
      skillsAssessment: StepProgress;
      experienceAnalysis: StepProgress;
    };
    company_matching: {
      initialPreferences: StepProgress;
      companyAnalysis: StepProgress;
      matchingResults: StepProgress;
    };
    preparation: {
      companyResearch: StepProgress;
      entrySheet: StepProgress;
      interview: StepProgress;
    };
  };
  currentStep?: {
    id: string;
    type: string;
    status: 'pending' | 'in_progress' | 'completed';
  };
}

export interface AgentResponse {
  message: string;
  context?: Partial<JobHuntingState>;
  interactiveElements?: any[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  requirements: string[];
  culture: string[];
  benefits: string[];
  matchScore?: number;
  matchingPoints?: string[];
  challengePoints?: string[];
}

export interface PreparationTask {
  id: string;
  type: 'research' | 'entry' | 'interview';
  title: string;
  description: string;
  guidance: string[];
  status: 'pending' | 'in_progress' | 'completed';
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PreparationStrategy {
  companyId: string;
  companyName: string;
  tasks: PreparationTask[];
  focusPoints: string[];
  timeline: string;
}

export interface SelfAnalysisProgress {
  valuesAnalysis: StepProgress;
  careerAspirations: StepProgress;
  strengthsWeaknesses: StepProgress;
  skillsAssessment: StepProgress;
  experienceAnalysis: StepProgress;
}

export interface CompanyMatchingProgress {
  initialPreferences: StepProgress;
  topMatchesFound: StepProgress;
  detailedAnalysisDone: StepProgress;
  companySelection: StepProgress;
}

export interface PreparationProgress {
  companyResearch: StepProgress;
  esDrafting: StepProgress;
  esReview: StepProgress;
  interviewPreparation: StepProgress;
  mockInterview: StepProgress;
}

export interface Context {
  phase: Phase;
  userGoal: UserGoal;
  progress: {
    self_analysis: SelfAnalysisProgress;
    company_matching: CompanyMatchingProgress;
    preparation: PreparationProgress;
  };
  currentStep: {
    id: string;
    type: string;
    status: 'pending' | 'in_progress' | 'completed';
  };
  userData: any; // 後で具体的な型を定義
}

export interface AgentMessage {
  type: 'data_transfer' | 'task_request' | 'task_response';
  from: string;
  to: string;
  payload: any;
  metadata: {
    timestamp: number;
    priority: number;
    context: Context;
  };
} 