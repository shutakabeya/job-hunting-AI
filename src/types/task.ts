export interface Task {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description?: string;
  dueDate: string; // ISO形式の日付文字列
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  type: 'es' | 'interview' | 'custom';
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TaskFormData {
  companyId: string;
  companyName: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  type: 'es' | 'interview' | 'custom';
}

export interface CompanyProgress {
  id: string;
  companyId: string;
  companyName: string;
  status: 'interested' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'accepted';
  notes?: string;
  lastUpdated: string;
  userId: string;
}

export interface CompanyProgressFormData {
  companyId: string;
  companyName: string;
  status: 'interested' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'accepted';
  notes?: string;
} 