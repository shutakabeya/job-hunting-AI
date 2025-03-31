import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// Supabase imports
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example function to fetch tasks from Supabase
async function fetchTasks() {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) console.error('Error fetching tasks:', error);
  return data;
}

interface TaskState {
  tasks: Task[];
  companyProgress: CompanyProgress[];
  isLoading: boolean;
  error: string | null;
  
  // タスク関連のアクション
  fetchTasks: (userId: string) => Promise<void>;
  addTask: (userId: string, taskData: TaskFormData) => Promise<void>;
  updateTask: (taskId: string, taskData: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // 企業進捗関連のアクション
  fetchCompanyProgress: (userId: string) => Promise<void>;
  updateCompanyProgress: (userId: string, progressData: CompanyProgressFormData) => Promise<void>;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      companyProgress: [],
      isLoading: false,
      error: null,
      
      // タスクを取得
      fetchTasks: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const tasksQuery = query(
            collection(db, 'tasks'),
            where('userId', '==', userId),
            orderBy('dueDate', 'asc')
          );
          
          const querySnapshot = await getDocs(tasksQuery);
          const tasksData: Task[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            tasksData.push({
              id: doc.id,
              ...data,
              dueDate: data.dueDate.toDate().toISOString(),
              createdAt: data.createdAt.toDate().toISOString(),
              updatedAt: data.updatedAt.toDate().toISOString(),
            } as Task);
          });
          
          set({ tasks: tasksData, isLoading: false });
        } catch (error) {
          console.error('タスクの取得に失敗しました:', error);
          set({ error: 'タスクの取得に失敗しました', isLoading: false });
        }
      },
      
      // タスクを追加
      addTask: async (userId: string, taskData: TaskFormData) => {
        set({ isLoading: true, error: null });
        try {
          const taskRef = await addDoc(collection(db, 'tasks'), {
            ...taskData,
            userId,
            dueDate: Timestamp.fromDate(new Date(taskData.dueDate)),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          
          // 新しいタスクをストアに追加
          const newTask: Task = {
            id: taskRef.id,
            ...taskData,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          set((state) => ({
            tasks: [...state.tasks, newTask],
            isLoading: false,
          }));
        } catch (error) {
          console.error('タスクの追加に失敗しました:', error);
          set({ error: 'タスクの追加に失敗しました', isLoading: false });
        }
      },
      
      // タスクを更新
      updateTask: async (taskId: string, taskData: Partial<TaskFormData>) => {
        set({ isLoading: true, error: null });
        try {
          const taskRef = doc(db, 'tasks', taskId);
          
          const updateData: any = {
            ...taskData,
            updatedAt: serverTimestamp(),
          };
          
          // 日付が含まれている場合はTimestampに変換
          if (taskData.dueDate) {
            updateData.dueDate = Timestamp.fromDate(new Date(taskData.dueDate));
          }
          
          await updateDoc(taskRef, updateData);
          
          // ストア内のタスクを更新
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    ...taskData,
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('タスクの更新に失敗しました:', error);
          set({ error: 'タスクの更新に失敗しました', isLoading: false });
        }
      },
      
      // タスクを削除
      deleteTask: async (taskId: string) => {
        set({ isLoading: true, error: null });
        try {
          await deleteDoc(doc(db, 'tasks', taskId));
          
          // ストアからタスクを削除
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
            isLoading: false,
          }));
        } catch (error) {
          console.error('タスクの削除に失敗しました:', error);
          set({ error: 'タスクの削除に失敗しました', isLoading: false });
        }
      },
      
      // 企業進捗を取得
      fetchCompanyProgress: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const progressQuery = query(
            collection(db, 'companyProgress'),
            where('userId', '==', userId),
            orderBy('lastUpdated', 'desc')
          );
          
          const querySnapshot = await getDocs(progressQuery);
          const progressData: CompanyProgress[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            progressData.push({
              id: doc.id,
              ...data,
              lastUpdated: data.lastUpdated.toDate().toISOString(),
            } as CompanyProgress);
          });
          
          set({ companyProgress: progressData, isLoading: false });
        } catch (error) {
          console.error('企業進捗の取得に失敗しました:', error);
          set({ error: '企業進捗の取得に失敗しました', isLoading: false });
        }
      },
      
      // 企業進捗を更新
      updateCompanyProgress: async (userId: string, progressData: CompanyProgressFormData) => {
        set({ isLoading: true, error: null });
        try {
          // 既存の進捗を確認
          const progressQuery = query(
            collection(db, 'companyProgress'),
            where('userId', '==', userId),
            where('companyId', '==', progressData.companyId)
          );
          
          const querySnapshot = await getDocs(progressQuery);
          
          let progressId: string;
          
          if (querySnapshot.empty) {
            // 新規作成
            const progressRef = await addDoc(collection(db, 'companyProgress'), {
              ...progressData,
              userId,
              lastUpdated: serverTimestamp(),
            });
            progressId = progressRef.id;
          } else {
            // 更新
            progressId = querySnapshot.docs[0].id;
            const progressRef = doc(db, 'companyProgress', progressId);
            await updateDoc(progressRef, {
              ...progressData,
              lastUpdated: serverTimestamp(),
            });
          }
          
          // ストアを更新
          const newProgress: CompanyProgress = {
            id: progressId,
            ...progressData,
            userId,
            lastUpdated: new Date().toISOString(),
          };
          
          set((state) => {
            const existingIndex = state.companyProgress.findIndex(
              (p) => p.companyId === progressData.companyId
            );
            
            if (existingIndex >= 0) {
              // 既存の進捗を更新
              const updatedProgress = [...state.companyProgress];
              updatedProgress[existingIndex] = newProgress;
              return { companyProgress: updatedProgress, isLoading: false };
            } else {
              // 新しい進捗を追加
              return {
                companyProgress: [...state.companyProgress, newProgress],
                isLoading: false,
              };
            }
          });
        } catch (error) {
          console.error('企業進捗の更新に失敗しました:', error);
          set({ error: '企業進捗の更新に失敗しました', isLoading: false });
        }
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks, companyProgress: state.companyProgress }),
    }
  )
);

export default useTaskStore; 