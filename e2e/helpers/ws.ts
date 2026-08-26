export interface WsSession {
  socket: WebSocket;
  messages: unknown[];
  closed: { code: number; reason: string } | null;
  waitForMessage: (timeoutMs?: number) => Promise<unknown>;
  sendJson: (payload: unknown) => void;
  close: () => void;
}

export function connect(url: string, origin: string, timeoutMs = 5_000): Promise<WsSession> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url, { headers: { Origin: origin } } as unknown as string[]);
    const messages: unknown[] = [];
    const pending: ((value: unknown) => void)[] = [];
    let closed: { code: number; reason: string } | null = null;

    const timer = setTimeout(() => reject(new Error(`ws connect timeout: ${url}`)), timeoutMs);

    socket.addEventListener('message', (event: MessageEvent) => {
      let parsed: unknown = event.data;
      if (typeof event.data === 'string') {
        try {
          parsed = JSON.parse(event.data);
        } catch {
          parsed = event.data;
        }
      }
      messages.push(parsed);
      pending.shift()?.(parsed);
    });

    socket.addEventListener('close', (event: CloseEvent) => {
      closed = { code: event.code, reason: event.reason };
      clearTimeout(timer);
    });

    socket.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new Error(`ws error: ${url}`));
    });

    socket.addEventListener('open', () => {
      clearTimeout(timer);
      resolve({
        socket,
        messages,
        get closed() {
          return closed;
        },
        waitForMessage: (waitMs = 3_000) =>
          new Promise((resolveMessage, rejectMessage) => {
            if (messages.length > 0) {
              resolveMessage(messages[messages.length - 1]);
              return;
            }
            const messageTimer = setTimeout(
              () => rejectMessage(new Error('ws message timeout')),
              waitMs,
            );
            pending.push((value) => {
              clearTimeout(messageTimer);
              resolveMessage(value);
            });
          }),
        sendJson: (payload: unknown) => socket.send(JSON.stringify(payload)),
        close: () => socket.close(),
      } as WsSession);
    });
  });
}

export function isAlive(session: WsSession): boolean {
  return session.socket.readyState === WebSocket.OPEN;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
