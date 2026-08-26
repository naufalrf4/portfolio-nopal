import { timingSafeEqual } from "node:crypto";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "./config";
import { consumeAction } from "./staged-action-repository";
import type { ChatRequest, ConfirmRequest, ConfirmResponse, IngestRequest, IngestResponse } from "./types";
import { chat } from "./chat-service";
import { ingest } from "./ingest-service";
import { RagServiceError } from "./errors";
import { executeSubmitGuestbook, executeSendMessage, executeCreateBooking } from "./agentic-tools";

const app = new Hono();

const MAX_CHAT_MESSAGE_LENGTH = 2000;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

app.use(
  "*",
  cors({
    origin: config.corsOrigins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Accept-Language",
      "X-Service-Token",
    ],
    maxAge: 600,
  }),
);

function serviceTokenValid(token: string | null): boolean {
  if (!token) return false;
  const expected = config.ragIngestServiceToken || config.adminServiceToken;
  if (expected === "") return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/chat", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw new RagServiceError(
      "Invalid JSON body.",
      "INVALID_CHAT_REQUEST",
      400,
    );
  }

  const raw = body as Record<string, unknown>;
  const chatRequest: ChatRequest = {
    message: typeof raw.message === "string" ? raw.message.trim() : "",
  };
  if (typeof raw.sessionId === "string" && SESSION_ID_PATTERN.test(raw.sessionId)) {
    chatRequest.sessionId = raw.sessionId;
  }

  if (!chatRequest.message) {
    throw new RagServiceError(
      "message is required.",
      "INVALID_CHAT_REQUEST",
      400,
    );
  }

  if (chatRequest.message.length > MAX_CHAT_MESSAGE_LENGTH) {
    throw new RagServiceError(
      `message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or less.`,
      "INVALID_CHAT_REQUEST",
      400,
    );
  }

  const preferredLanguage = c.req.header("Accept-Language") ?? undefined;
  const response = await chat(chatRequest, preferredLanguage);
  return c.json(response);
});

app.post("/chat/confirm", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw new RagServiceError("Invalid JSON body.", "INVALID_CONFIRM_REQUEST", 400);
  }

  const raw = body as Record<string, unknown>;
  const actionId = typeof raw.actionId === "string" ? raw.actionId : "";
  const sessionId = typeof raw.sessionId === "string" ? raw.sessionId : "";
  const confirm = Boolean(raw.confirm);

  if (!UUID_PATTERN.test(actionId)) {
    throw new RagServiceError("actionId is required.", "INVALID_CONFIRM_REQUEST", 400);
  }

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    throw new RagServiceError("sessionId is required.", "INVALID_CONFIRM_REQUEST", 400);
  }

  const staged = await consumeAction(actionId, sessionId);

  if (!confirm) {
    const response: ConfirmResponse = {
      success: true,
      message: "Action cancelled.",
    };
    return c.json(response);
  }

  if (staged === null) {
    throw new RagServiceError(
      "This action is no longer available. Please ask again.",
      "STAGED_ACTION_UNAVAILABLE",
      409,
    );
  }

  const adminApiUrl = config.adminApiUrl;

  let result: { success: boolean; message: string };
  if (staged.tool === "submit_guestbook") {
    result = await executeSubmitGuestbook(staged.payload, adminApiUrl);
  } else if (staged.tool === "send_message") {
    result = await executeSendMessage(staged.payload, adminApiUrl);
  } else if (staged.tool === "create_booking") {
    result = await executeCreateBooking(staged.payload, adminApiUrl);
  } else {
    throw new RagServiceError(`Unknown tool: ${staged.tool}`, "UNKNOWN_TOOL", 400);
  }

  const response: ConfirmResponse = result;
  return c.json(response);
});

app.post("/ingest", async (c) => {
  const token = c.req.header("X-Service-Token") ?? null;
  if (!serviceTokenValid(token)) {
    return c.json(
      {
        success: false,
        error: { message: "Unauthorized.", code: "UNAUTHORIZED" },
      },
      401,
    );
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    throw new RagServiceError(
      "Invalid JSON body.",
      "INVALID_INGEST_REQUEST",
      400,
    );
  }

  const raw = body as Record<string, unknown>;
  const type = String(raw.type ?? "all");
  if (!["knowledge", "project", "blog", "about", "all"].includes(type)) {
    throw new RagServiceError(
      `Invalid ingest type "${type}".`,
      "INVALID_INGEST_REQUEST",
      400,
    );
  }

  const ingestRequest: IngestRequest = {
    type: type as IngestRequest["type"],
  };
  if (typeof raw.documentId === "string") {
    ingestRequest.documentId = raw.documentId;
  }

  if (
    (ingestRequest.type === "knowledge" ||
      ingestRequest.type === "project" ||
      ingestRequest.type === "blog") &&
    !ingestRequest.documentId
  ) {
    throw new RagServiceError(
      `documentId is required for type "${ingestRequest.type}".`,
      "INVALID_INGEST_REQUEST",
      400,
    );
  }

  const result: IngestResponse = await ingest(ingestRequest);
  return c.json({ success: true, data: result });
});

app.onError((err, c) => {
  console.error("RAG service error:", err);
  if (err instanceof RagServiceError) {
    return c.json(
      {
        success: false,
        error: { message: err.message, code: err.code },
      },
      err.statusCode as never,
    );
  }
  return c.json(
    {
      success: false,
      error: {
        message: "Internal server error.",
        code: "INTERNAL_ERROR",
      },
    },
    500,
  );
});

export default {
  port: config.port,
  hostname: config.host,
  fetch: app.fetch,
};
