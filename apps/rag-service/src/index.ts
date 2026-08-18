import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "./config";
import type { ChatRequest, ConfirmRequest, ConfirmResponse, IngestRequest, IngestResponse } from "./types";
import { chat } from "./chat-service";
import { ingest } from "./ingest-service";
import { RagServiceError } from "./errors";
import { executeSubmitGuestbook, executeSendMessage, executeCreateBooking } from "./agentic-tools";

const app = new Hono();

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
  return expected !== "" && token === expected;
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
  if (typeof raw.sessionId === "string") {
    chatRequest.sessionId = raw.sessionId;
  }

  if (!chatRequest.message) {
    throw new RagServiceError(
      "message is required.",
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
  const tool = String(raw.tool ?? "");
  const confirm = Boolean(raw.confirm);
  const payload = (raw.payload ?? {}) as Record<string, unknown>;

  if (!tool) {
    throw new RagServiceError("tool is required.", "INVALID_CONFIRM_REQUEST", 400);
  }

  if (!confirm) {
    const response: ConfirmResponse = {
      success: true,
      message: "Action cancelled.",
    };
    return c.json(response);
  }

  const adminApiUrl = config.adminApiUrl;

  let result: { success: boolean; message: string };
  if (tool === "submit_guestbook") {
    result = await executeSubmitGuestbook(payload, adminApiUrl);
  } else if (tool === "send_message") {
    result = await executeSendMessage(payload, adminApiUrl);
  } else if (tool === "create_booking") {
    result = await executeCreateBooking(payload, adminApiUrl);
  } else {
    throw new RagServiceError(`Unknown tool: ${tool}`, "UNKNOWN_TOOL", 400);
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
