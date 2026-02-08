type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = "info";

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
    };

    // In production, send to logging service (e.g., Sentry, LogRocket)
    if (process.env.NODE_ENV === "production") {
      // Send to external logging service
      this.sendToLoggingService(logEntry);
    } else {
      console[level](`[${timestamp}] ${level.toUpperCase()}:`, message, context || "");
    }
  }

  private sendToLoggingService(entry: unknown): void {
    // Implement external logging (Sentry, etc.)
    // Example: Sentry.captureMessage(entry.message, entry.level);
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      this.log("debug", message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      this.log("info", message, context);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      this.log("warn", message, context);
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog("error")) {
      this.log("error", message, context);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }
}

export const logger = Logger.getInstance();
