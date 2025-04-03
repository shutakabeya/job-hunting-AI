export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  interactiveElements?: InteractiveElement[];
}

export interface ChatContext {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface JobHuntingState {
  phase: 'initial' | 'self-analysis' | 'matching' | 'feedback' | 'todo';
  currentStep: number;
  progress: number;
  context?: any;
}

export interface InteractiveElement {
  id: string;
  text: string;
  type: 'button';
}

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'select' | 'radio';
  weight: number;
}

export interface UserVector {
  values: string[];
  careerGoals: string[];
  skills: string[];
  experience: string[];
}

export interface Company {
  id: string;
  name: string;
  description: string;
  values: string[];
  requiredSkills: string[];
  culture: string[];
  matchScore: number;
}

export interface MatchResult {
  company: Company;
  matchScore: number;
  matchExplanation: string;
}

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  industry?: string;
  size?: string;
  businessDetails?: string;
  strengths: string[];
  interests: string[];
  skills: string[];
  workStyle: string;
  organization: string;
  growth: string;
  values: string;
  relationships: string;
  customerContact: string;
  businessStyle: string;
  evaluation: string;
  diversity: string;
  stability: string;
  workStyleTags: string[];
  organizationTags: string[];
  growthTags: string[];
  valuesTags: string[];
  relationshipsTags: string[];
  customerContactTags: string[];
  businessStyleTags: string[];
  evaluationTags: string[];
  diversityTags: string[];
  stabilityTags: string[];
}

export interface CompanyMatch {
  company: CompanyData;
  matchScore: number;
  matchingPoints: string[];
  challengePoints: string[];
} 