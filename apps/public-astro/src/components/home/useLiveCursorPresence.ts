import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveLiveCursorIdentity, type LiveCursorIdentity } from '@/lib/guestbookIdentity';

export interface LiveCursorParticipant {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  isTouching: boolean;
  pagePath: string;
  pageLabel: string;
  sectionId: string | null;
  sectionLabel: string | null;
  lastSeen: number;
}

type Status = 'connecting' | 'connected' | 'disconnected';

type PresenceMessage =
  | { type: 'welcome'; payload: { selfId: string; roomId: string } }
  | { type: 'state'; payload: { participants: LiveCursorParticipant[] } }
  | { type: 'overview'; payload: { participants: LiveCursorParticipant[] } };

const HEARTBEAT_MS = 5000;
const SEND_INTERVAL_MS = 60;
const RECONNECT_DELAY_MS = 5000;
const HEALTHCHECK_TIMEOUT_MS = 1500;

function getSocketUrl(socketUrl: string): string {
  return socketUrl.trim() || 'ws://localhost:3006/ws';
}

function getHealthUrl(socketUrl: string): string | null {
  try {
    const url = new URL(getSocketUrl(socketUrl));
    url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:';
    url.pathname = '/health';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return null;
  }
}

function resolveRoomId(currentPath: string): string {
  if (!currentPath || currentPath === '/') {
    return 'public-home';
  }

  return `public${currentPath.replace(/[^a-zA-Z0-9/_-]/g, '')}`;
}

export function useLiveCursorPresence(currentPath: string, socketUrl: string) {
  const [status, setStatus] = useState<Status>('disconnected');
  const [participants, setParticipants] = useState<LiveCursorParticipant[]>([]);
  const [overviewParticipants, setOverviewParticipants] = useState<LiveCursorParticipant[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [identity, setIdentity] = useState<LiveCursorIdentity | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const shouldReconnectRef = useRef(false);
  const queuedMoveRef = useRef<{ x: number; y: number; isTouching: boolean } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastSentAtRef = useRef(0);
  const roomId = resolveRoomId(currentPath);

  const clearTimers = useCallback(() => {
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(
    (activeIdentity: LiveCursorIdentity) => {
      clearTimers();
      if (!shouldReconnectRef.current || reconnectTimeoutRef.current) {
        return;
      }

      reconnectTimeoutRef.current = window.setTimeout(() => {
        reconnectTimeoutRef.current = null;
        void connect(activeIdentity);
      }, RECONNECT_DELAY_MS);
    },
    [clearTimers]
  );

  const sendMessage = useCallback((message: object) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    socket.send(JSON.stringify(message));
  }, []);

  const flushQueuedMove = useCallback(() => {
    rafRef.current = null;
    const queuedMove = queuedMoveRef.current;
    if (!queuedMove) {
      return;
    }

    const now = performance.now();
    if (now - lastSentAtRef.current < SEND_INTERVAL_MS) {
      rafRef.current = window.requestAnimationFrame(flushQueuedMove);
      return;
    }

    lastSentAtRef.current = now;
    queuedMoveRef.current = null;
    sendMessage({ type: 'move', payload: queuedMove });
  }, [sendMessage]);

  const pageLabel =
    currentPath === '/'
      ? 'Home'
      : currentPath
          .split('/')
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' / ');

  const sendMove = useCallback(
    (move: {
      x: number;
      y: number;
      isTouching: boolean;
      sectionId: string | null;
      sectionLabel: string | null;
    }) => {
      queuedMoveRef.current = move;
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(flushQueuedMove);
      }
    },
    [flushQueuedMove]
  );

  const connect = useCallback(
    async (activeIdentity: LiveCursorIdentity) => {
      clearTimers();
      shouldReconnectRef.current = true;
      setStatus('connecting');
      setParticipants([]);
      setOverviewParticipants([]);
      setSelfId(null);

      const healthUrl = getHealthUrl(socketUrl);
      if (healthUrl) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT_MS);

        try {
          const response = await fetch(healthUrl, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store',
          });

          if (!response.ok) {
            throw new Error(`Presence health check failed with status ${response.status}`);
          }
        } catch {
          if (shouldReconnectRef.current) {
            setStatus('disconnected');
            scheduleReconnect(activeIdentity);
          }
          return;
        } finally {
          window.clearTimeout(timeout);
        }
      }

      const socket = new WebSocket(getSocketUrl(socketUrl));
      socketRef.current = socket;

      socket.addEventListener('open', () => {
        if (socketRef.current !== socket) {
          return;
        }

        setStatus('connected');
        sendMessage({
          type: 'join',
          payload: {
            roomId,
            name: activeIdentity.name,
            color: activeIdentity.color,
            x: 0.5,
            y: 0.5,
            isTouching: false,
            pagePath: currentPath,
            pageLabel,
            sectionId: null,
            sectionLabel: null,
          },
        });

        heartbeatRef.current = window.setInterval(() => {
          if (socketRef.current === socket) {
            sendMessage({ type: 'ping' });
          }
        }, HEARTBEAT_MS);
      });

      socket.addEventListener('message', (event) => {
        if (socketRef.current !== socket) {
          return;
        }

        try {
          const message = JSON.parse(event.data) as PresenceMessage;
          if (message.type === 'welcome') {
            setSelfId(message.payload.selfId);
            return;
          }
          if (message.type === 'state') {
            setParticipants(message.payload.participants);
            return;
          }
          if (message.type === 'overview') {
            setOverviewParticipants(message.payload.participants);
          }
        } catch {
          // Ignore invalid frames.
        }
      });

      socket.addEventListener('close', () => {
        if (socketRef.current === socket) {
          socketRef.current = null;
          setStatus('disconnected');
        }

        clearTimers();
        if (!shouldReconnectRef.current || socketRef.current !== null) {
          return;
        }

        scheduleReconnect(activeIdentity);
      });

      socket.addEventListener('error', () => {
        if (socketRef.current === socket) {
          setStatus('disconnected');
        }
      });
    },
    [clearTimers, currentPath, pageLabel, roomId, scheduleReconnect, sendMessage, socketUrl]
  );

  useEffect(() => {
    setIdentity(resolveLiveCursorIdentity());

    return () => {
      shouldReconnectRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (!identity) {
      return;
    }

    void connect(identity);

    return () => {
      shouldReconnectRef.current = false;
      const activeSocket = socketRef.current;
      clearTimers();
      queuedMoveRef.current = null;
      setParticipants([]);
      setOverviewParticipants([]);
      setSelfId(null);

      if (activeSocket?.readyState === WebSocket.OPEN) {
        activeSocket.send(JSON.stringify({ type: 'leave' }));
      }

      if (socketRef.current === activeSocket) {
        socketRef.current = null;
      }

      activeSocket?.close();
    };
  }, [clearTimers, connect, identity]);

  const self = participants.find((participant) => participant.id === selfId) || null;
  const others = participants.filter((participant) => participant.id !== selfId);

  return {
    identity,
    status,
    self,
    others,
    overviewParticipants,
    totalParticipants: overviewParticipants.length || participants.length,
    sendMove,
  };
}
