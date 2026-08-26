import { describe, expect, test } from 'bun:test';
import { env } from '../../helpers/env';
import { describeResponse, postJson, probe, type Probe } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';

const ready = await available('admin');

function expectGated(res: Probe): void {
  const detail = describeResponse(res);
  if (res.status === 401 || res.status === 403) return;
  expect([302, 307, 308], detail).toContain(res.status);
  expect(res.headers.get('location') ?? '', detail).toContain('/auth/signin');
}

describe.if(ready)('admin-auth', () => {
  test('POST /api/v1/admin/messages never reaches the handler unauthenticated', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/admin/messages`, {
      content: 'e2e unauthenticated write attempt',
    });
    expectGated(res);
  });

  test('GET /api/v1/admin/messages is gated unauthenticated', async () => {
    const res = await probe(`${env.ADMIN_URL}/api/v1/admin/messages`);
    expectGated(res);
  });

  test('admin dashboard is gated unauthenticated', async () => {
    const res = await probe(`${env.ADMIN_URL}/dashboard`);
    expectGated(res);
  });

  test('internal tier rejects requests without a service token', async () => {
    const res = await probe(`${env.ADMIN_URL}/api/v1/internal/knowledge`);
    const detail = describeResponse(res);
    expect(res.status, detail).not.toBe(200);
  });
});

if (!ready) {
  test.skip(`admin-auth skipped: admin not reachable at ${env.ADMIN_URL}`, () => {});
}
