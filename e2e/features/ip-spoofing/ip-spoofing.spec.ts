import { describe, expect, test } from 'bun:test';
import { buildProxyHeaders } from '@naufalrf/http';
import { env } from '../../helpers/env';
import { describeResponse, postJson } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';


describe('proxy header contract', () => {
  test('client x-forwarded-for is dropped without a trusted socket address', () => {
    const headers = buildProxyHeaders(
      'e2e',
      '/contact',
      new Headers({ 'x-forwarded-for': '6.6.6.6' }),
    );
    expect(headers.get('x-forwarded-for')).toBeNull();
  });

  test('trusted socket address is appended as the last hop', () => {
    const headers = buildProxyHeaders(
      'e2e',
      '/contact',
      new Headers({ 'x-forwarded-for': '6.6.6.6, 7.7.7.7' }),
      'Asia/Jakarta',
      '203.0.113.9',
    );
    const chain = headers.get('x-forwarded-for') ?? '';
    const hops = chain.split(',').map((hop) => hop.trim());
    expect(hops.at(-1)).toBe('203.0.113.9');
  });

  test('other client-controlled ip headers are never relayed', () => {
    const headers = buildProxyHeaders(
      'e2e',
      '/contact',
      new Headers({
        'x-real-ip': '6.6.6.6',
        'cf-connecting-ip': '6.6.6.6',
        'x-vercel-forwarded-for': '6.6.6.6',
      }),
      undefined,
      '203.0.113.9',
    );
    expect(headers.get('x-real-ip')).toBeNull();
    expect(headers.get('cf-connecting-ip')).toBeNull();
    expect(headers.get('x-vercel-forwarded-for')).toBeNull();
  });
});

const ready = await available('public');

describe.if(ready)('spoofed headers through the public proxy', () => {
  test('spoofed forwarding headers do not break the request path', async () => {
    const res = await postJson(
      `${env.PUBLIC_URL}/api/analytics`,
      { eventType: 'e2e_spoof', path: '/e2e' },
      {
        'x-forwarded-for': '6.6.6.6',
        'x-real-ip': '6.6.6.6',
        'cf-connecting-ip': '6.6.6.6',
      },
    );
    expect(res.status, describeResponse(res)).toBeLessThan(500);
  });

  test('absurdly long forwarding chain is handled without a server error', async () => {
    const chain = Array.from({ length: 60 }, (_, i) => `10.0.0.${i % 255}`).join(', ');
    const res = await postJson(
      `${env.PUBLIC_URL}/api/analytics`,
      { eventType: 'e2e_spoof_chain', path: '/e2e' },
      { 'x-forwarded-for': chain },
    );
    expect(res.status, describeResponse(res)).toBeLessThan(500);
  });
});

if (!ready) {
  test.skip(`public proxy checks skipped: not reachable at ${env.PUBLIC_URL}`, () => {});
}
