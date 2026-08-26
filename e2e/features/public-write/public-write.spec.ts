import { describe, expect, test } from 'bun:test';
import { env } from '../../helpers/env';
import { describeResponse, postJson } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';

const ready = await available('admin');

describe.if(ready)('public contact bounds', () => {
  test('oversized message is rejected', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/contact`, {
      name: 'E2E Bounds',
      email: 'bounds@example.com',
      subject: 'bounds check',
      message: 'x'.repeat(5_001),
      turnstileToken: 'e2e-placeholder',
    });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });

  test('oversized name is rejected', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/contact`, {
      name: 'n'.repeat(101),
      email: 'bounds@example.com',
      subject: 'bounds check',
      message: 'valid message body',
      turnstileToken: 'e2e-placeholder',
    });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });

  test('malformed email is rejected', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/contact`, {
      name: 'E2E Bounds',
      email: 'not-an-email',
      subject: 'bounds check',
      message: 'valid message body',
      turnstileToken: 'e2e-placeholder',
    });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });
});

describe.if(ready)('public analytics bounds', () => {
  test('data payload with too many keys is rejected', async () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < 21; i += 1) data[`key_${i}`] = 'value';
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/analytics`, {
      eventType: 'e2e_bounds',
      path: '/e2e',
      data,
    });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });

  test('oversized string value is rejected', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/analytics`, {
      eventType: 'e2e_bounds',
      path: '/e2e',
      data: { note: 'v'.repeat(501) },
    });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });

  test('oversized key name is rejected', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/analytics`, {
      eventType: 'e2e_bounds',
      path: '/e2e',
      data: { ['k'.repeat(65)]: 'value' },
    });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });
});

describe.if(ready)('public guestbook bounds', () => {
  test('empty message is rejected', async () => {
    const res = await postJson(`${env.ADMIN_URL}/api/v1/public/guestbook`, {
      message: '',
      turnstileToken: 'e2e-placeholder',
    });
    expect([400, 401, 403, 422], describeResponse(res)).toContain(res.status);
  });
});

if (!ready) {
  test.skip(`public-write skipped: admin not reachable at ${env.ADMIN_URL}`, () => {});
}
