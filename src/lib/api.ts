import { JobHuntingState, AgentResponse } from '@/types/agent';

interface ApiError {
  error: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error((data as ApiError).error || 'APIエラーが発生しました');
  }
  return data as T;
};

export const api = {
  chat: {
    send: async (message: string, context?: Partial<JobHuntingState>): Promise<AgentResponse> => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });
      return handleResponse<AgentResponse>(response);
    },
  },

  interaction: {
    handle: async (
      elementId: string,
      action: string,
      data: any,
      context?: Partial<JobHuntingState>
    ): Promise<AgentResponse> => {
      const response = await fetch('/api/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elementId, action, data, context }),
      });
      return handleResponse<AgentResponse>(response);
    },
  },

  progress: {
    get: async () => {
      const response = await fetch('/api/progress');
      return handleResponse<{
        progress: JobHuntingState['progress'];
        currentPhase: JobHuntingState['phase'];
        currentStep: JobHuntingState['currentStep'];
      }>(response);
    },

    update: async (
      phase: JobHuntingState['phase'],
      stepId: string,
      status?: 'pending' | 'in_progress' | 'completed',
      data?: any
    ) => {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phase, stepId, status, data }),
      });
      return handleResponse<{
        progress: JobHuntingState['progress'];
        currentPhase: JobHuntingState['phase'];
        currentStep: JobHuntingState['currentStep'];
      }>(response);
    },
  },
}; 