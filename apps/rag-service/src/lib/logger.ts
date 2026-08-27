type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  correlationId?: string;
  duration?: number;
}

class Logger {
  private service: string;
  private isDevelopment: boolean;

  constructor(service: string = 'rag-service') {
    this.service = service;
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: unknown
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      service: this.service,
      message,
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      if (error instanceof Error) {
        entry.error = {
          name: error.name,
          message: error.message,
          ...(this.isDevelopment && error.stack ? { stack: error.stack } : {}),
        };
      } else {
        entry.error = {
          name: 'UnknownError',
          message: String(error),
        };
      }
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      const levelColors: Record<LogLevel, string> = {
        debug: '\x1b[36m',
        info: '\x1b[32m',
        warn: '\x1b[33m',
        error: '\x1b[31m',
      };
      const reset = '\x1b[0m';
      const color = levelColors[entry.level];

      console.log(
        `${color}[${entry.timestamp}] ${entry.level.toUpperCase()} [${entry.service}]${reset} ${entry.message}`
      );

      if (entry.context) {
        console.log('  Context:', JSON.stringify(entry.context, null, 2));
      }

      if (entry.error) {
        console.error('  Error:', entry.error.name, '-', entry.error.message);
        if (entry.error.stack) {
          console.error('  Stack:', entry.error.stack);
        }
      }
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.output(this.createLogEntry('debug', message, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.output(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.output(this.createLogEntry('warn', message, context));
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.output(this.createLogEntry('error', message, context, error));
  }

  request(method: string, path: string, status: number, duration: number): void {
    this.info('HTTP Request', {
      method,
      path,
      status,
      duration: `${duration}ms`,
    });
  }

  database(operation: string, table: string, duration: number): void {
    this.debug('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
    });
  }
}

export const logger = new Logger();
