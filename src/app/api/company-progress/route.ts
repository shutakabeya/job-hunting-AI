import { NextRequest, NextResponse } from 'next/server';
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

// Supabase imports
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example function to fetch company progress from Supabase
async function fetchCompanyProgress() {
  const { data, error } = await supabase.from('company_progress').select('*');
  if (error) console.error('Error fetching company progress:', error);
  return data;
}

// 企業進捗一覧を取得
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
    
    const progressQuery = query(
      collection(db, 'companyProgress'),
      where('userId', '==', userId),
      orderBy('lastUpdated', 'desc')
    );
    
    const querySnapshot = await getDocs(progressQuery);
    const progressList = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      progressList.push({
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated.toDate().toISOString(),
      });
    });
    
    return NextResponse.json({ companyProgress: progressList });
  } catch (error: any) {
    console.error('企業進捗の取得に失敗しました:', error);
    return NextResponse.json(
      { error: `企業進捗の取得に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
}

// 企業進捗を更新または作成
export async function POST(req: NextRequest) {
  try {
    const { userId, ...progressData } = await req.json();
    
    if (!userId || !progressData.companyId || !progressData.companyName || !progressData.status) {
      return NextResponse.json(
        { error: 'ユーザーID、企業ID、企業名、ステータスは必須です' },
        { status: 400 }
      );
    }
    
    // 既存の進捗を確認
    const progressQuery = query(
      collection(db, 'companyProgress'),
      where('userId', '==', userId),
      where('companyId', '==', progressData.companyId)
    );
    
    const querySnapshot = await getDocs(progressQuery);
    
    let progressId;
    
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
    
    return NextResponse.json({
      id: progressId,
      ...progressData,
      userId,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('企業進捗の更新に失敗しました:', error);
    return NextResponse.json(
      { error: `企業進捗の更新に失敗しました: ${error.message}` },
      { status: 500 }
    );
  }
} 