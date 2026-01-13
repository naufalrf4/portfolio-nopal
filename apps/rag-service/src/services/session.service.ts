import { env } from '../config/env';
import { logger } from '../utils/logger';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastAccessedAt: Date;
}

class SessionService {
  private sessions = new Map<string, Session>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.cleanupInterval) return;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    logger.info('Session cleanup scheduler started');
  }

  stop(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  getOrCreate(sessionId: string): Session {
    let session = this.sessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        lastAccessedAt: new Date(),
      };
      this.sessions.set(sessionId, session);
      logger.debug({ sessionId }, 'Created new session');
    } else {
      session.lastAccessedAt = new Date();
    }

    return session;
  }

  addMessage(sessionId: string, role: 'user' | 'assistant', content: string): void {
    const session = this.getOrCreate(sessionId);
    session.messages.push({
      role,
      content,
      timestamp: new Date(),
    });
    session.lastAccessedAt = new Date();
  }

  getHistory(sessionId: string, limit?: number): Message[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];

    const maxMessages = limit ?? env.MAX_HISTORY_MESSAGES;
    return session.messages.slice(-maxMessages);
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getActiveSessions(): number {
    return this.sessions.size;
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of this.sessions) {
      if (now - session.lastAccessedAt.getTime() > env.SESSION_TTL_MS) {
        this.sessions.delete(id);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info({ cleaned, remaining: this.sessions.size }, 'Session cleanup completed');
    }
  }
}

export const sessionService = new SessionService();
