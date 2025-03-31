-- ユーザーベクトルテーブル
CREATE TABLE IF NOT EXISTS user_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  scores FLOAT[] NOT NULL,
  categories TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- マッチング結果テーブル
CREATE TABLE IF NOT EXISTS match_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  company_id TEXT NOT NULL,
  match_score FLOAT NOT NULL,
  matching_categories TEXT[] NOT NULL,
  match_explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ToDoテーブル
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  steps TEXT[] NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_vectors_user_id ON user_vectors(user_id);
CREATE INDEX IF NOT EXISTS idx_match_results_user_id ON match_results(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- RLSポリシーの設定
ALTER TABLE user_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- ユーザーベクトルのポリシー
CREATE POLICY "Users can view their own vectors"
  ON user_vectors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vectors"
  ON user_vectors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- マッチング結果のポリシー
CREATE POLICY "Users can view their own match results"
  ON match_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own match results"
  ON match_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ToDoのポリシー
CREATE POLICY "Users can view their own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id); 