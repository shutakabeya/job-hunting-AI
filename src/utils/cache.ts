type CacheEntry = {
  data: any;
  timestamp: number;
};

class APICache {
  private cache: Map<string, CacheEntry>;
  private ttl: number; // キャッシュの有効期限（ミリ秒）

  constructor(ttl: number = 5 * 60 * 1000) { // デフォルト5分
    this.cache = new Map();
    this.ttl = ttl;
  }

  private generateKey(endpoint: string, params: any): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  get(endpoint: string, params: any): any | null {
    const key = this.generateKey(endpoint, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // キャッシュの有効期限をチェック
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(endpoint: string, params: any, data: any): void {
    const key = this.generateKey(endpoint, params);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // 期限切れのキャッシュをクリーンアップ
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// シングルトンインスタンスを作成
export const apiCache = new APICache(); 