import { create } from 'zustand';
import { AnalysisResult } from '@/agents/types';

interface AnalysisState {
  currentStep: number;
  questions: string[];
  answers: string[];
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  setCurrentStep: (step: number) => void;
  addQuestion: (question: string) => void;
  addAnswer: (answer: string) => void;
  setResult: (result: AnalysisResult) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  currentStep: 0,
  questions: [],
  answers: [],
  result: null,
  isAnalyzing: false,
  setCurrentStep: (step) => set({ currentStep: step }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  addAnswer: (answer) => set((state) => ({ answers: [...state.answers, answer] })),
  setResult: (result) => set({ result }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
})); 