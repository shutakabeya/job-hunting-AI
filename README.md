# 就活AIエージェント

「自己分析 × 企業選び × 行動最適化」をサポートする就活AIエージェントプロジェクトです。

## 🎯 プロジェクト概要

- AI駆動の就活支援ツールとして、対話型インターフェースを提供
- 自己分析、企業選び、行動最適化をサポート
- Next.js 14とモダンなフロントエンド技術を活用

## 🛠️ 技術スタック

- **Next.js 14**（App Router）
- **Tailwind CSS**（レスポンシブデザイン）
- **Zustand**（状態管理）
- **Supabase**（データベース・認証）
- **Vercel**（フロントエンドデプロイ）

## 🚀 セットアップ方法

1. リポジトリをクローン
   ```
   git clone <repository-url>
   cd job-hunting-ai
   ```

2. 依存関係のインストール
   ```
   npm install
   ```

3. 環境変数の設定
   `.env.local`ファイルにSupabaseの認証情報を設定してください：
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. 開発サーバーの起動
   ```
   npm run dev
   ```

5. ブラウザで以下のURLにアクセス
   ```
   http://localhost:3000
   ```

## 📁 プロジェクト構造

```
job-hunting-ai/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # 再利用可能なコンポーネント
│   ├── hooks/         # カスタムフック
│   ├── store/         # Zustand状態管理
│   └── utils/         # ユーティリティ関数（Supabaseクライアントなど）
├── public/            # 静的ファイル
└── ...
```

## 📝 開発ガイドライン

- コンポーネントは`src/components`ディレクトリに配置
- 状態管理は`src/store`のZustandストアを使用
- データベース操作は`src/utils/supabase.js`のクライアントを使用

## 🔧 セットアップスクリプト

プロジェクトルートにある`setup.js`を実行することで、必要な依存関係のインストールやディレクトリ構造の作成を自動化できます：

```
node setup.js
```

## 📄 ライセンス

[MIT](LICENSE)
