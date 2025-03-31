'use client';

import { useState, useEffect } from 'react';

export interface ProgressState {
  currentStep: string;
  completedSteps: number;
  totalSteps: number;
}

export function useProgress() {
  const [progressState, setProgressState] = useState<ProgressState>({
    currentStep: '自己分析',
    completedSteps: 2,
    totalSteps: 5
  });
  const [error, setError] = useState<Error | null>(null);

  return { progressState, setProgressState, error };
} 