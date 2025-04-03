import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

interface TaskManagerProps {
  companyId: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ companyId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      if (!companyId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${companyId}`);
        if (!response.ok) throw new Error('タスクの取得に失敗しました');
        
        const data = await response.json();
        if (isMounted) {
          setTasks(data.tasks || []);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [companyId]); // companyIdが変更された時のみ実行

  if (loading) {
    return <div className="p-4">タスクを読み込み中...</div>;
  }

  if (tasks.length === 0) {
    return <div className="p-4">現在のタスクはありません</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">タスク一覧</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-sm ${
                task.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {task.status === 'completed' ? '完了'
                  : task.status === 'in_progress' ? '進行中'
                  : '未着手'}
              </span>
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => {/* タスクの状態更新処理 */}}
              >
                更新
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 