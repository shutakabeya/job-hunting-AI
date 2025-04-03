'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/types/task';
import useTaskStore from '@/store/taskStore';
import { CompanyWithScore } from '@/types/company';

interface TaskFormProps {
  task?: Task;
  companies: CompanyWithScore[];
  onClose: () => void;
}

export default function TaskForm({ task, companies, onClose }: TaskFormProps) {
  const { addTask, updateTask, isLoading, error } = useTaskStore();
  
  const [formData, setFormData] = useState<TaskFormData>({
    companyId: task?.companyId || '',
    companyName: task?.companyName || '',
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    type: task?.type || 'custom',
  });
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(task?.companyId || '');
  
  // 企業が選択された時に会社名を自動設定
  useEffect(() => {
    if (selectedCompanyId) {
      const selectedCompany = companies.find(company => company.id === selectedCompanyId);
      if (selectedCompany) {
        setFormData(prev => ({
          ...prev,
          companyId: selectedCompanyId,
          companyName: selectedCompany.name
        }));
      }
    }
  }, [selectedCompanyId, companies]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 仮のユーザーID（実際の実装では認証システムから取得）
    const userId = 'user-1';
    
    if (task) {
      // 既存タスクの更新
      await updateTask(task.id, formData);
    } else {
      // 新規タスクの作成
      await addTask(userId, formData);
    }
    
    if (!error) {
      onClose();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {task ? 'タスクを編集' : '新しいタスクを作成'}
      </h2>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            企業
          </label>
          <select
            name="companyId"
            value={selectedCompanyId}
            onChange={handleCompanyChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          >
            <option value="">企業を選択</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            タイトル
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            説明
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            期日
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              ステータス
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="pending">未着手</option>
              <option value="in-progress">進行中</option>
              <option value="completed">完了</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              優先度
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              タイプ
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="es">ES提出</option>
              <option value="interview">面接</option>
              <option value="custom">カスタム</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${
              isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            {isLoading ? '保存中...' : task ? '更新' : '作成'}
          </button>
        </div>
      </form>
    </div>
  );
} 