import { describe, expect, test } from 'bun:test';
import { env, requireEnv } from '../../helpers/env';
import { describeResponse, postJson, probe } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';

const ready = await available('admin');
const CRON_URL = `${env.ADMIN_URL}/api/cron/cleanup-chatlogs`;

describe.if(ready)('admin-cron fail-closed', () => {
  test('POST without Authorization is rejected', async () => {
    const res = await postJson(CRON_URL, {});
    expect(res.status, describeResponse(res)).toBe(401);
  });

  test('GET without Authorization is rejected', async () => {
    const res = await probe(CRON_URL);
    expect(res.status, describeResponse(res)).toBe(401);
  });

  test('wrong bearer secret is rejected', async () => {
    const res = await postJson(CRON_URL, {}, { authorization: 'Bearer definitely-not-the-secret' });
    expect(res.status, describeResponse(res)).toBe(401);
  });
});

const missing = requireEnv(['CRON_SECRET']);

describe.if(ready && !missing)('admin-cron authorized path', () => {
  test('correct bearer secret passes authorization', async () => {
    const res = await postJson(CRON_URL, {}, { authorization: `Bearer ${env.CRON_SECRET}` });
    expect(res.status, describeResponse(res)).not.toBe(401);
  });
});

if (ready && missing) {
  test.skip(`admin-cron authorized path skipped: ${missing}`, () => {});
}

if (!ready) {
  test.skip(`admin-cron skipped: admin not reachable at ${env.ADMIN_URL}`, () => {});
}
