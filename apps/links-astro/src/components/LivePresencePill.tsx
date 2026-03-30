import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity } from 'lucide-react';

type Status = 'connecting' | 'connected' | 'disconnected';

type PresenceParticipant = {
  id: string;
  name: string;
  color: string;
  pageLabel: string;
  sectionLabel: string | null;
};

type PresenceMessage =
  | { type: 'welcome'; payload: { selfId: string; roomId: string } }
  | { type: 'overview'; payload: { participants: PresenceParticipant[] } };

type LivePresencePillProps = {
  socketUrl: string;
  pagePath: string;
  pageLabel: string;
};

const HEARTBEAT_MS = 5000;
const RECONNECT_DELAY_MS = 5000;
const HEALTHCHECK_TIMEOUT_MS = 1500;
const SHARED_GUEST_KEY = 'portfolio-live-presence-guest';

function getSocketUrl(socketUrl: string) {
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

function hashString(value: string) {
  return Array.from(value).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function getColorFromSeed(seed: string) {
  const palette = ['#3B82F6', '#60A5FA', '#38BDF8', '#22C55E', '#8B5CF6', '#0EA5E9'];
  return palette[hashString(seed) % palette.length] || '#3B82F6';
}

function buildGuestIdentity() {
  if (typeof window === 'undefined') {
    return { id: 'guest:links', name: 'Guest_links', color: '#3B82F6' };
  }

  try {
    const raw = window.localStorage.getItem(SHARED_GUEST_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { id?: string; name?: string; color?: string };
      if (parsed.id && parsed.name && parsed.color) {
        return { id: parsed.id, name: parsed.name, color: parsed.color };
      }
    }
  } catch {
    // Ignore broken storage and regenerate.
  }

  const alias = `Guest_${Math.random().toString(36).slice(2, 6)}`;
  const identity = {
    id: `guest:${alias.toLowerCase()}`,
    name: alias,
    color: getColorFromSeed(alias),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SHARED_GUEST_KEY, JSON.stringify(identity));
  }

  return identity;
}

export function LivePresencePill({ socketUrl, pagePath, pageLabel }: LivePresencePillProps) {
  const [status, setStatus] = useState<Status>('disconnected');
  const [participants, setParticipants] = useState<PresenceParticipant[]>([]);
  const [selfId, setSelfId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const shouldReconnectRef = useRef(false);
  const identity = useMemo(() => buildGuestIdentity(), []);

  useEffect(() => {
    function clearTimers() {
      if (heartbeatRef.current) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    }

    function scheduleReconnect() {
      clearTimers();
      if (!shouldReconnectRef.current || reconnectTimeoutRef.current) return;
      reconnectTimeoutRef.current = window.setTimeout(() => {
        reconnectTimeoutRef.current = null;
        void connect();
      }, RECONNECT_DELAY_MS);
    }

    async function connect() {
      clearTimers();
      shouldReconnectRef.current = true;
      setStatus('connecting');

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
          setStatus('disconnected');
          scheduleReconnect();
          return;
        } finally {
          window.clearTimeout(timeout);
        }
      }

      const socket = new WebSocket(getSocketUrl(socketUrl));
      socketRef.current = socket;

      socket.addEventListener('open', () => {
        if (socketRef.current !== socket) return;
        setStatus('connected');
        socket.send(
          JSON.stringify({
            type: 'join',
            payload: {
              roomId: 'links-home',
              name: identity.name,
              color: identity.color,
              x: 0.5,
              y: 0.5,
              isTouching: false,
              pagePath,
              pageLabel,
              sectionId: null,
              sectionLabel: null,
            },
          })
        );

        heartbeatRef.current = window.setInterval(() => {
          if (socketRef.current === socket) {
            socket.send(JSON.stringify({ type: 'ping' }));
          }
        }, HEARTBEAT_MS);
      });

      socket.addEventListener('message', (event) => {
        if (socketRef.current !== socket) return;

        try {
          const message = JSON.parse(event.data) as PresenceMessage;
          if (message.type === 'welcome') {
            setSelfId(message.payload.selfId);
            return;
          }

          if (message.type === 'overview') {
            setParticipants(
              message.payload.participants
                .slice()
                .sort(
                  (a, b) => a.pageLabel.localeCompare(b.pageLabel) || a.name.localeCompare(b.name)
                )
            );
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

        scheduleReconnect();
      });

      socket.addEventListener('error', () => {
        if (socketRef.current === socket) {
          setStatus('disconnected');
        }
      });
    }

    void connect();

    return () => {
      shouldReconnectRef.current = false;
      clearTimers();
      const activeSocket = socketRef.current;
      if (activeSocket?.readyState === WebSocket.OPEN) {
        activeSocket.send(JSON.stringify({ type: 'leave' }));
      }
      if (socketRef.current === activeSocket) {
        socketRef.current = null;
      }
      activeSocket?.close();
    };
  }, [identity.color, identity.name, pageLabel, pagePath, socketUrl]);

  return (
    <div className="fixed right-4 top-5 z-[52] flex justify-end px-4 md:right-6 md:top-6 md:px-0 lg:left-6 lg:right-auto lg:top-auto lg:bottom-8">
      <div className="pointer-events-auto flex flex-col items-end gap-3 lg:items-start">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex max-w-[calc(100vw-2.5rem)] items-center justify-center gap-2 rounded-full border border-white/60 bg-[linear-gradient(150deg,rgba(247,250,255,0.82),rgba(231,239,249,0.72))] px-2.5 py-1.5 text-[10px] font-semibold text-[#475569] shadow-neu-extruded-sm backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5 md:max-w-[260px] md:px-4 md:py-2 md:text-[11px]"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/72 px-2 py-1 shadow-neu-inset md:px-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${status === 'connected' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.75)]' : status === 'connecting' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.65)]' : 'bg-slate-300 shadow-none'}`}
            />
            <Activity size={11} className="hidden text-[#3B82F6] md:block" />
            <span className="md:hidden">{participants.length} Online</span>
            <span className="hidden md:inline">{participants.length} Online</span>
          </span>
        </button>

        {isOpen ? (
          <div className="w-[min(92vw,360px)] rounded-[24px] border border-white/65 bg-[linear-gradient(160deg,rgba(248,251,255,0.94),rgba(233,240,249,0.88))] p-3 shadow-neu-extruded backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                  Live now
                </p>
                <p className="text-sm font-semibold text-[#334155]">Shared portfolio presence</p>
              </div>
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-[#3B82F6] shadow-neu-inset">
                {participants.length}
              </span>
            </div>

            <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
              {participants.map((participant) => (
                <div
                  key={`${participant.id}-${participant.pageLabel}`}
                  className="flex items-start justify-between gap-3 rounded-[18px] border border-white/55 bg-white/75 px-3 py-2.5 shadow-neu-extruded-sm"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: participant.color }}
                      />
                      <p className="truncate text-sm font-semibold text-[#334155]">
                        {participant.name}
                      </p>
                    </div>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">
                      {participant.pageLabel}
                    </p>
                    <p className="mt-1 text-xs text-[#475569]">
                      {participant.sectionLabel || 'Browsing page'}
                    </p>
                  </div>
                  {participant.id === selfId ? (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">
                      Here
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
