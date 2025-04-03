'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import useTaskStore from '@/store/taskStore';
import { CalendarDays, CheckCircle, Clock, Edit, Trash2, AlertCircle } from 'lucide-react';
import TaskForm from './TaskForm';
import { CompanyWithScore } from '@/types/company';
import Card from '@/components/Card';

interface TaskListProps {
  companies: CompanyWithScore[];
}

export default function TaskList({ companies }: TaskListProps) {
  const { tasks, fetchTasks, updateTask, deleteTask, isLoading, error } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  
  // 仮のユーザーID（実際の実装では認証システムから取得）
  const userId = 'user-1';
  
  useEffect(() => {
    fetchTasks(userId);
  }, [fetchTasks]);
  
  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = async (taskId: string) => {
    if (confirm('このタスクを削除してもよろしいですか？')) {
      await deleteTask(taskId);
    }
  };
  
  const handleStatusToggle = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const isPastDue = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };
  
  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'es': return 'ES提出';
      case 'interview': return '面接';
      case 'custom': return 'カスタム';
      default: return type;
    }
  };
  
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-yellow-500 dark:text-yellow-400';
      case 'low': return 'text-green-500 dark:text-green-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              タスク管理
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              企業選びの進捗やES提出、面接準備のタスクを管理します
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              新しいタスク
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="flex space-x-2 mb-2 md:mb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg ${
                filter === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-lg ${
                filter === 'pending'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              未完了
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-lg ${
                filter === 'completed'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              完了済み
            </button>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400 mr-2">並び替え:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
              className="px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="dueDate">期日</option>
              <option value="priority">優先度</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg">
            {error}
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>タスクがありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">ステータス</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">タスク</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">企業</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">タイプ</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">期日</th>
                  <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300">優先度</th>
                  <th className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">アクション</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`border-b border-gray-200 dark:border-gray-700 ${
                      task.status === 'completed'
                        ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusToggle(task)}
                        className="focus:outline-none"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : task.status === 'in-progress' ? (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className={task.status === 'completed' ? 'line-through' : ''}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{task.companyName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        {getTaskTypeLabel(task.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                        <span
                          className={
                            isPastDue(task.dueDate) && task.status !== 'completed'
                              ? 'text-red-500 dark:text-red-400 font-medium flex items-center'
                              : ''
                          }
                        >
                          {formatDate(task.dueDate)}
                          {isPastDue(task.dueDate) && task.status !== 'completed' && (
                            <AlertCircle className="w-4 h-4 ml-1 text-red-500 dark:text-red-400" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={getTaskPriorityColor(task.priority)}>
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(task)}
                          className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task.id)}
                          className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full">
            <TaskForm
              task={selectedTask || undefined}
              companies={companies}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
} 