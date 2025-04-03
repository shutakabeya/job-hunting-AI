export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: string;
  businessDetails: string;
  strengths: string[];
  interests: string[];
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
  steps: string[];
  interviewFocus: string[];
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
  deadlines?: string[];
  commonQuestions?: string[];
  website?: string;
}

export interface CompanyMatch {
  company: Company;
  matchScore: number;
  matchReason: string;
}

export interface CompanyProgress {
  companyId: string;
  userId: string;
  completedSteps: number[];
  lastUpdated: string;
}

export interface CompanyWithStrategy extends Company {
  strategy: {
    steps: string[];
    interviewFocus: string;
    deadlines: string[];
    commonQuestions: string[];
  };
}

export interface UserProfile {
  id: string;
  workHistory: string;
  skills: string[];
  interests: string[];
  values: string[];
  education: string;
  certifications: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
}

export interface CompanyWithScore extends Company {
  matchScore: number;
  matchReason?: string;
}

export interface CompanyStrategy {
  steps: string[];
  interviewFocus: string;
  deadlines?: string[];
  commonQuestions?: string[];
} 