'use client';

import { useState, useEffect } from 'react';
import { CompanyProgress, CompanyProgressFormData } from '@/types/task';
import useTaskStore from '@/store/taskStore';
import { CompanyWithScore } from '@/types/company';

interface CompanyProgressFormProps {
  companyProgress?: CompanyProgress;
  companies: CompanyWithScore[];
  onClose: () => void;
}

export default function CompanyProgressForm({
  companyProgress,
  companies,
  onClose,
}: CompanyProgressFormProps) {
  const { updateCompanyProgress, isLoading, error } = useTaskStore();
  
  const [formData, setFormData] = useState<CompanyProgressFormData>({
    companyId: companyProgress?.companyId || '',
    companyName: companyProgress?.companyName || '',
    status: companyProgress?.status || 'interested',
    notes: companyProgress?.notes || '',
  });
  
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyProgress?.companyId || '');
  
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
    
    await updateCompanyProgress(userId, formData);
    
    if (!error) {
      onClose();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {companyProgress ? '企業進捗を更新' : '企業進捗を登録'}
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
            disabled={!!companyProgress} // 既存の進捗を編集する場合は企業を変更できないようにする
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
            ステータス
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          >
            <option value="interested">興味あり</option>
            <option value="applied">応募済み</option>
            <option value="interviewing">面接中</option>
            <option value="offer">内定</option>
            <option value="accepted">内定承諾</option>
            <option value="rejected">不採用</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            メモ
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            rows={3}
          />
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
            {isLoading ? '保存中...' : companyProgress ? '更新' : '登録'}
          </button>
        </div>
      </form>
    </div>
  );
} 