const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 色付きログ出力のためのユーティリティ
const log = {
  info: (msg) => console.log('\x1b[36m%s\x1b[0m', `[INFO] ${msg}`),
  success: (msg) => console.log('\x1b[32m%s\x1b[0m', `[SUCCESS] ${msg}`),
  warning: (msg) => console.log('\x1b[33m%s\x1b[0m', `[WARNING] ${msg}`),
  error: (msg) => console.log('\x1b[31m%s\x1b[0m', `[ERROR] ${msg}`)
};

// セットアップ処理を実行
async function setup() {
  try {
    log.info('就活AIエージェントのセットアップを開始します...');

    // 1. 依存関係のインストール
    log.info('必要なパッケージをインストールしています...');
    execSync('npm install @supabase/supabase-js zustand framer-motion', { stdio: 'inherit' });
    log.success('パッケージのインストールが完了しました');

    // 2. ディレクトリ構造の確認と作成
    const directories = [
      'src/store',
      'src/utils',
      'src/components',
      'src/hooks'
    ];

    directories.forEach(dir => {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        log.info(`${dir} ディレクトリを作成しています...`);
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
    log.success('ディレクトリ構造の作成が完了しました');

    // 3. Zustandストアの作成
    const storeContent = `import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useStore;`;

    fs.writeFileSync(path.join(process.cwd(), 'src/store/index.js'), storeContent);
    log.success('Zustandストアの作成が完了しました');

    // 4. Supabaseクライアントの作成
    const supabaseClientContent = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);`;

    fs.writeFileSync(path.join(process.cwd(), 'src/utils/supabase.js'), supabaseClientContent);
    log.success('Supabaseクライアントの作成が完了しました');

    // 5. .env.localファイルの作成
    if (!fs.existsSync(path.join(process.cwd(), '.env.local'))) {
      const envContent = `NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=`;
      fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent);
      log.success('.env.localファイルの作成が完了しました');
      log.warning('Supabaseの認証情報を.env.localファイルに手動で入力してください');
    }

    log.success('セットアップが完了しました！');
    log.info('開発サーバーを起動するには "npm run dev" を実行してください');

  } catch (error) {
    log.error(`セットアップ中にエラーが発生しました: ${error.message}`);
    process.exit(1);
  }
}

setup(); 