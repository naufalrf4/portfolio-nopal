import { createHmac } from 'node:crypto';
import { describe, expect, test } from 'bun:test';
import { env, requireEnv } from '../../helpers/env';
import { describeResponse, probe } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';


const missing = requireEnv(['WEBHOOK_SECRET']);
const ready = missing ? false : await available('webhook');

function sign(body: string, secret: string): string {
  return `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
}

describe.if(ready)('deploy webhook', () => {
  test('unsigned payload is rejected', async () => {
    const res = await probe(env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-github-event': 'push' },
      body: JSON.stringify({ ref: 'refs/heads/main' }),
    });
    expect(res.status, describeResponse(res)).toBeGreaterThanOrEqual(400);
  });

  test('wrong signature is rejected', async () => {
    const body = JSON.stringify({ ref: 'refs/heads/main' });
    const res = await probe(env.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-github-event': 'push',
        'x-hub-signature-256': sign(body, 'wrong-secret'),
      },
      body,
    });
    expect(res.status, describeResponse(res)).toBeGreaterThanOrEqual(400);
  });

  test('oversized content-length is refused before the body is read', async () => {
    const res = await probe(env.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-github-event': 'push',
        'content-length': String(6 * 1024 * 1024),
      },
      body: JSON.stringify({ ref: 'refs/heads/main' }),
    });
    expect(res.status, describeResponse(res)).toBeGreaterThanOrEqual(400);
  });

  test('path traversal delivery id does not create files outside the state dir', async () => {
    const body = JSON.stringify({ ref: 'refs/heads/main' });
    const res = await probe(env.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-github-event': 'push',
        'x-github-delivery': '../../../../tmp/e2e-traversal',
        'x-hub-signature-256': sign(body, env.WEBHOOK_SECRET as string),
      },
      body,
    });
    expect(res.status, describeResponse(res)).toBeLessThan(500);
  });
});

if (!ready) {
  const reason = missing ?? `webhook server not reachable at ${env.WEBHOOK_URL}`;
  test.skip(`webhook skipped: ${reason}`, () => {});
}
