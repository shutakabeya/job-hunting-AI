import { supabase } from './client';

interface MatchExplanationRequest {
  userVector: {
    categories: string[];
    scores: number[];
  };
  company: {
    name: string;
    tags: string[];
  };
  matchingCategories: string[];
}

interface TodoDetailsRequest {
  todoId: string;
}

export async function generateMatchExplanation(request: MatchExplanationRequest) {
  const { data, error } = await supabase.functions.invoke('generate-match-explanation', {
    body: request,
  });

  if (error) throw error;
  return data;
}

export async function generateTodoDetails(request: TodoDetailsRequest) {
  const { data, error } = await supabase.functions.invoke('generate-todo-details', {
    body: request,
  });

  if (error) throw error;
  return data;
} 