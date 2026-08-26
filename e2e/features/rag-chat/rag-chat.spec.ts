import { describe, expect, test } from 'bun:test';
import { env, requireEnv } from '../../helpers/env';
import { describeResponse, postJson, probe } from '../../helpers/http';
import { available } from '../../helpers/services';
export { manifest } from './manifest';

const ready = await available('rag');

describe.if(ready)('rag health', () => {
  test('health responds ok', async () => {
    const res = await probe(`${env.RAG_URL}/health`);
    expect(res.status, describeResponse(res)).toBe(200);
  });
});

describe.if(ready)('rag ingest auth', () => {
  test('missing service token is rejected', async () => {
    const res = await postJson(`${env.RAG_URL}/ingest`, { type: 'all' });
    expect(res.status, describeResponse(res)).toBe(401);
  });

  test('wrong service token is rejected', async () => {
    const res = await postJson(
      `${env.RAG_URL}/ingest`,
      { type: 'all' },
      { 'x-service-token': 'definitely-not-the-token' },
    );
    expect(res.status, describeResponse(res)).toBe(401);
  });
});

const missingToken = requireEnv(['RAG_INGEST_SERVICE_TOKEN']);

describe.if(ready && !missingToken)('rag ingest authorized path', () => {
  test('valid token passes auth and fails on payload validation instead', async () => {
    const res = await postJson(
      `${env.RAG_URL}/ingest`,
      { type: 'definitely-not-a-valid-type' },
      { 'x-service-token': env.RAG_INGEST_SERVICE_TOKEN as string },
    );
    expect(res.status, describeResponse(res)).not.toBe(401);
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });
});

if (ready && missingToken) {
  test.skip(`rag ingest authorized path skipped: ${missingToken}`, () => {});
}

describe.if(ready)('rag chat input bounds', () => {
  test('oversized chat message is rejected', async () => {
    const res = await postJson(`${env.RAG_URL}/chat`, { message: 'x'.repeat(2_001) });
    expect(res.status, describeResponse(res)).toBe(400);
    expect(res.text).toContain('2000');
  });

  test('empty chat message is rejected', async () => {
    const res = await postJson(`${env.RAG_URL}/chat`, { message: '' });
    expect([400, 422], describeResponse(res)).toContain(res.status);
  });

  test('path-traversal sessionId is ignored instead of propagating', async () => {
    const res = await postJson(`${env.RAG_URL}/chat`, {
      message: 'hello',
      sessionId: '../../etc/passwd',
    });
    const detail = describeResponse(res);
    const body = res.json<{ error?: { code?: string } }>();
    const code = body?.error?.code ?? '';
    expect(res.status < 500 || code === 'LLM_API_KEY_NOT_CONFIGURED', detail).toBe(true);
    expect(res.text, detail).not.toContain('etc/passwd');
  });
});

describe.if(ready)('rag staged-action confirm contract', () => {
  const forgedActionId = '11111111-2222-3333-4444-555555555555';
  const sessionId = 'e2estagedsession';

  test('missing actionId is rejected', async () => {
    const res = await postJson(`${env.RAG_URL}/chat/confirm`, { confirm: true, sessionId });
    expect(res.status, describeResponse(res)).toBe(400);
    expect(res.text).toContain('INVALID_CONFIRM_REQUEST');
  });

  test('malformed sessionId is rejected', async () => {
    const res = await postJson(`${env.RAG_URL}/chat/confirm`, {
      actionId: forgedActionId,
      sessionId: '../../etc/passwd',
      confirm: true,
    });
    expect(res.status, describeResponse(res)).toBe(400);
    expect(res.text).toContain('INVALID_CONFIRM_REQUEST');
  });

  test('client-supplied tool and payload cannot drive execution', async () => {
    const res = await postJson(`${env.RAG_URL}/chat/confirm`, {
      tool: 'submit_guestbook',
      confirm: true,
      payload: { message: 'x'.repeat(900) },
    });
    expect(res.status, describeResponse(res)).toBe(400);
    expect(res.text).toContain('INVALID_CONFIRM_REQUEST');
  });

  test('unstaged actionId cannot be confirmed', async () => {
    const res = await postJson(`${env.RAG_URL}/chat/confirm`, {
      actionId: forgedActionId,
      sessionId,
      confirm: true,
    });
    expect(res.status, describeResponse(res)).toBe(409);
    expect(res.text).toContain('STAGED_ACTION_UNAVAILABLE');
  });

  test('declining an unknown action does not leak whether it existed', async () => {
    const res = await postJson(`${env.RAG_URL}/chat/confirm`, {
      actionId: forgedActionId,
      sessionId,
      confirm: false,
    });
    expect(res.status, describeResponse(res)).toBe(200);
    expect(res.text).toContain('cancelled');
  });
});

if (!ready) {
  test.skip(`rag-chat skipped: not reachable at ${env.RAG_URL}`, () => {});
}
