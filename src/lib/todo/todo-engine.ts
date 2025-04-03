import { CsvLoader, TodoData } from '../utils/csv-loader';
import { supabase } from '../supabase/client';
import { generateTodoDetails } from '../supabase/edge-functions';

export interface Todo {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: string[];
  status: 'pending' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}

export class TodoEngine {
  private csvLoader: CsvLoader;

  constructor() {
    this.csvLoader = new CsvLoader();
  }

  public async getTodos(): Promise<Todo[]> {
    const { data: todos, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return todos || [];
  }

  public async getTodoDetails(todoId: string): Promise<string> {
    try {
      const response = await generateTodoDetails({ todoId });
      return response.details;
    } catch (error) {
      console.error('ToDo詳細の生成に失敗しました:', error);
      return 'ToDo詳細の生成に失敗しました。';
    }
  }

  public async updateTodoStatus(todoId: string, status: Todo['status']): Promise<void> {
    const updates: Partial<Todo> = {
      status,
      ...(status === 'in_progress' && { startedAt: new Date().toISOString() }),
      ...(status === 'completed' && { completedAt: new Date().toISOString() }),
    };

    const { error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', todoId);

    if (error) throw error;
  }

  public async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .insert([todo])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public async deleteTodo(todoId: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);

    if (error) throw error;
  }
} 