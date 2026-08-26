import { describe, expect, test } from 'bun:test';
import { env } from '../../helpers/env';
import { describeResponse, probe } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';
import { connect, isAlive, wait } from '../../helpers/ws';

const ready = await available('presence');
const WS_URL = `${env.PRESENCE_URL.replace(/^http/, 'ws')}/ws`;

describe.if(ready)('presence health', () => {
  test('health exposes nothing beyond ok flag', async () => {
    const res = await probe(`${env.PRESENCE_URL}/health`);
    expect(res.status, describeResponse(res)).toBe(200);
    expect(res.json<{ ok: boolean }>()).toEqual({ ok: true });
  });
});

describe.if(ready)('presence origin enforcement', () => {
  test('foreign origin cannot upgrade', async () => {
    await expect(connect(WS_URL, 'http://evil.example', 3_000)).rejects.toThrow();
  });

  test('allowed origin receives welcome frame', async () => {
    const session = await connect(WS_URL, env.PRESENCE_ORIGIN);
    session.sendJson({ type: 'join', payload: { roomId: 'public-home', name: 'e2e' } });
    const message = await session.waitForMessage();
    expect(message).toMatchObject({ type: 'welcome' });
    session.close();
  });
});

describe.if(ready)('presence frame limits', () => {
  test('oversized frame is ignored without killing the server', async () => {
    const session = await connect(WS_URL, env.PRESENCE_ORIGIN);
    session.sendJson({ type: 'join', payload: { roomId: 'public-home', name: 'e2e-frames' } });
    await session.waitForMessage();
    session.sendJson({ type: 'move', payload: { pageLabel: 'x'.repeat(9_000) } });
    await wait(300);
    expect(isAlive(session)).toBe(true);
    session.close();

    const res = await probe(`${env.PRESENCE_URL}/health`);
    expect(res.status, describeResponse(res)).toBe(200);
  });
});

if (!ready) {
  test.skip(`presence skipped: not reachable at ${env.PRESENCE_URL}`, () => {});
}
