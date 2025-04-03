import { NextRequest, NextResponse } from 'next/server';
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

// タスク一覧を取得
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーIDが必要です' },
        { status: 400 }
      );
    }
    
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('dueDate', 'asc')
    );
    
    const querySnapshot = await getDocs(tasksQuery);
    const tasks = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        ...data,
        dueDate: data.dueDate.toDate().toISOString(),
        createdAt: data.createdAt.toDate().toISOString(),
        updatedAt: data.updatedAt.toDate().toISOString(),
      });
    });
    
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('タスクの取得に失敗しました:', error);
    return NextResponse.json(
      { error: `タスクの取得に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}

// 新しいタスクを作成
export async function POST(req: NextRequest) {
  try {
    const { userId, ...taskData } = await req.json();
    
    if (!userId || !taskData.title || !taskData.dueDate) {
      return NextResponse.json(
        { error: 'ユーザーID、タイトル、期日は必須です' },
        { status: 400 }
      );
    }
    
    const taskRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId,
      dueDate: Timestamp.fromDate(new Date(taskData.dueDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({
      id: taskRef.id,
      ...taskData,
      userId,
    });
  } catch (error: any) {
    console.error('タスクの作成に失敗しました:', error);
    return NextResponse.json(
      { error: `タスクの作成に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}

// タスクを更新
export async function PUT(req: NextRequest) {
  try {
    const { taskId, ...taskData } = await req.json();
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'タスクIDは必須です' },
        { status: 400 }
      );
    }
    
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
    
    return NextResponse.json({
      id: taskId,
      ...taskData,
    });
  } catch (error: any) {
    console.error('タスクの更新に失敗しました:', error);
    return NextResponse.json(
      { error: `タスクの更新に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}

// タスクを削除
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const taskId = url.searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json(
        { error: 'タスクIDは必須です' },
        { status: 400 }
      );
    }
    
    await deleteDoc(doc(db, 'tasks', taskId));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('タスクの削除に失敗しました:', error);
    return NextResponse.json(
      { error: `タスクの削除に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
} 