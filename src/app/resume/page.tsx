'use client';

import { useState } from 'react';
import { FileText, Download, Save } from 'lucide-react';

export default function ResumePage() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
    education: [],
    experience: [],
    skills: [],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">履歴書作成</h1>
        <p className="text-gray-600">
          あなたのプロフィールに基づいて、効果的な履歴書を作成しましょう。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">基本情報</h2>
          <FileText className="w-6 h-6 text-gray-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              お名前
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="山田 太郎"
              value={resumeData.personalInfo.name}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              value={resumeData.personalInfo.email}
              onChange={(e) =>
                setResumeData({
                  ...resumeData,
                  personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">現在開発中</h2>
        <p className="text-gray-600 mb-4">
          履歴書作成機能は現在開発中です。以下の機能を実装予定です：
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>学歴情報の入力</li>
          <li>職歴情報の入力</li>
          <li>スキルと資格の入力</li>
          <li>自己PRの作成支援</li>
          <li>複数のテンプレートから選択</li>
          <li>PDFでのエクスポート</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md flex items-center space-x-2 hover:bg-gray-200"
          onClick={() => {}}
        >
          <Save className="w-5 h-5" />
          <span>下書き保存</span>
        </button>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center space-x-2 hover:bg-blue-700"
          onClick={() => {}}
        >
          <Download className="w-5 h-5" />
          <span>PDFダウンロード</span>
        </button>
      </div>
    </div>
  );
} 