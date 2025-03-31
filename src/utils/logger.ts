type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // 最大保持ログ数

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // 古いログを削除
    }

    // 開発環境の場合はコンソールにも出力
    if (process.env.NODE_ENV === 'development') {
      const logMethod = {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
      }[entry.level];

      logMethod(
        `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`,
        entry.data || ''
      );
    }
  }

  debug(message: string, data?: any): void {
    this.addLog(this.createLogEntry('debug', message, data));
  }

  info(message: string, data?: any): void {
    this.addLog(this.createLogEntry('info', message, data));
  }

  warn(message: string, data?: any): void {
    this.addLog(this.createLogEntry('warn', message, data));
  }

  error(message: string, data?: any): void {
    this.addLog(this.createLogEntry('error', message, data));
  }

  // API関連のログ用のメソッド
  logAPIRequest(endpoint: string, method: string, params: any): void {
    this.info(`API Request: ${method} ${endpoint}`, { params });
  }

  logAPIResponse(endpoint: string, response: any, duration: number): void {
    this.info(`API Response: ${endpoint}`, {
      duration: `${duration}ms`,
      response
    });
  }

  logAPIError(endpoint: string, error: any): void {
    this.error(`API Error: ${endpoint}`, error);
  }

  // ログの取得
  getLogs(level?: LogLevel): LogEntry[] {
    return level
      ? this.logs.filter(log => log.level === level)
      : [...this.logs];
  }

  // ログのクリア
  clearLogs(): void {
    this.logs = [];
  }

  // 特定期間のログを取得
  getLogsByTimeRange(startTime: Date, endTime: Date): LogEntry[] {
    return this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
  }
}

// シングルトンインスタンスを作成
export const logger = new Logger(); 