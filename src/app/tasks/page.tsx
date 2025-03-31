'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Check, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  deadline: string;
  status: 'pending' | 'completed';
  category: 'self_analysis' | 'company_research' | 'application' | 'interview';
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '自己分析を完了する',
      deadline: '2024-03-20',
      status: 'pending',
      category: 'self_analysis',
    },
    {
      id: '2',
      title: '企業研究：テックイノベーション株式会社',
      deadline: '2024-03-25',
      status: 'pending',
      category: 'company_research',
    },
  ]);

  const categoryLabels = {
    self_analysis: '自己分析',
    company_research: '企業研究',
    application: 'エントリー',
    interview: '面接',
  };

  const categoryColors = {
    self_analysis: 'bg-blue-500',
    company_research: 'bg-green-500',
    application: 'bg-yellow-500',
    interview: 'bg-purple-500',
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">タスク管理</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-5 h-5" />
            <span>新規タスク</span>
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-400'
                    }`}
                  >
                    {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div>
                    <h3 className={`text-lg font-medium ${
                      task.status === 'completed' ? 'line-through text-gray-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs text-white rounded-full ${categoryColors[task.category]}`}>
                        {categoryLabels[task.category]}
                      </span>
                      <span className="text-sm text-gray-500">
                        期限: {task.deadline}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 