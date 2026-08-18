
// ---- types ----

export type AgenticToolName = "submit_guestbook" | "send_message" | "create_booking";

export interface PendingAction {
  tool: AgenticToolName;
  /** Staged payload that will be sent to Admin public API on confirmation. */
  payload: Record<string, unknown>;
  /** Human-readable description shown in chat. */
  description: string;
  /** Required fields that are still missing. */
  missingFields: string[];
}

export interface ToolStageResult {
  pendingAction: PendingAction;
  message: string; // What to show the user in chat
}

// ---- tool implementations ----

export function stageSubmitGuestbook(
  message: string,
  guestbookToken?: string,
): ToolStageResult {
  const missing: string[] = [];
  if (!message || message.trim().length === 0) missing.push("message");
  if (!guestbookToken) missing.push("guestbook token (sign in to guestbook first)");

  const description = `Post to guestbook: "${message.slice(0, 80)}${message.length > 80 ? '…' : ''}"`;

  if (missing.length > 0) {
    return {
      pendingAction: {
        tool: "submit_guestbook",
        payload: { message: message.trim() },
        description,
        missingFields: missing,
      },
      message: `I can post that to the guestbook, but I still need: ${missing.join(', ')}. ${
        missing.includes('guestbook token (sign in to guestbook first)')
          ? 'Please sign in using the guestbook button on the homepage first.'
          : ''
      }`,
    };
  }

  return {
    pendingAction: {
      tool: "submit_guestbook",
      payload: { message: message.trim(), guestbookToken },
      description,
      missingFields: [],
    },
    message: `Ready to post to the guestbook: "${message.trim()}". Confirm to continue.`,
  };
}

export function stageSendMessage(
  content: string,
): ToolStageResult {
  const missing: string[] = [];
  if (!content || content.trim().length === 0) missing.push("content");

  const description = `Send anonymous message: "${content.slice(0, 80)}${content.length > 80 ? '…' : ''}"`;

  if (missing.length > 0) {
    return {
      pendingAction: {
        tool: "send_message",
        payload: { content: content.trim() },
        description,
        missingFields: missing,
      },
      message: `I can send that message, but I still need: ${missing.join(', ')}. Please provide the message content.`,
    };
  }

  return {
    pendingAction: {
      tool: "send_message",
      payload: { content: content.trim() },
      description,
      missingFields: [],
    },
    message: `Ready to send your message. Confirm to continue.`,
  };
}

export function stageCreateBooking(
  slotId: string,
  name: string,
  email: string,
  notes?: string,
  phone?: string,
): ToolStageResult {
  const missing: string[] = [];
  if (!slotId) missing.push("slotId");
  if (!name || name.trim().length === 0) missing.push("name");
  if (!email || !email.includes("@")) missing.push("valid email");

  const description = `Create booking for ${name || 'you'} at slot ${slotId}`;

  if (missing.length > 0) {
    return {
      pendingAction: {
        tool: "create_booking",
        payload: { slotId, name: name.trim(), email: email.trim(), notes, phone },
        description,
        missingFields: missing,
      },
      message: `I can create that booking, but I still need: ${missing.join(', ')}.`,
    };
  }

  return {
    pendingAction: {
      tool: "create_booking",
      payload: { slotId, name: name.trim(), email: email.trim(), notes, phone },
      description,
      missingFields: [],
    },
    message: `Ready to book slot ${slotId} for ${name} (${email}). Confirm to continue.`,
  };
}

// ---- Admin public API executors (called after user confirms) ----

export async function executeSubmitGuestbook(
  payload: Record<string, unknown>,
  adminApiUrl: string,
): Promise<{ success: boolean; message: string }> {
  const message = String(payload.message ?? '').trim();
  const guestbookToken = String(payload.guestbookToken ?? '');

  const res = await fetch(`${adminApiUrl.replace(/\/$/, "")}/api/v1/public/guestbook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      guestbookToken,
      // turnstileToken: empty — the confirmation click IS the user verification
      turnstileToken: "",
    }),
  });

  const data = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    const err = data.error as { message?: string } | undefined;
    return {
      success: false,
      message: err?.message ?? `Guestbook submission failed (${res.status})`,
    };
  }

  return { success: true, message: "Guestbook entry posted successfully!" };
}

export async function executeSendMessage(
  payload: Record<string, unknown>,
  adminApiUrl: string,
): Promise<{ success: boolean; message: string }> {
  const content = String(payload.content ?? '').trim();

  const res = await fetch(`${adminApiUrl.replace(/\/$/, "")}/api/v1/public/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      turnstileToken: "",
    }),
  });

  const data = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    const err = data.error as { message?: string } | undefined;
    return {
      success: false,
      message: err?.message ?? `Message send failed (${res.status})`,
    };
  }

  return { success: true, message: "Message sent successfully!" };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PLACEHOLDER_VALUES = new Set(["", "tbd", "you", "unknown", "n/a", "none", "unknown@unknown.com"]);

function isPlaceholderValue(value: string): boolean {
  return PLACEHOLDER_VALUES.has(value.trim().toLowerCase());
}

export async function executeCreateBooking(
  payload: Record<string, unknown>,
  adminApiUrl: string,
): Promise<{ success: boolean; message: string }> {
  const slotId = String(payload.slotId ?? '').trim();
  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const notes = payload.notes != null ? String(payload.notes) : undefined;
  const phone = payload.phone != null ? String(payload.phone) : undefined;

  if (isPlaceholderValue(slotId)) {
    return { success: false, message: "Booking rejected: slotId is missing or a placeholder value." };
  }
  if (isPlaceholderValue(email) || !EMAIL_REGEX.test(email)) {
    return { success: false, message: "Booking rejected: a valid email is required." };
  }

  const res = await fetch(`${adminApiUrl.replace(/\/$/, "")}/api/v1/public/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slotId,
      name,
      email,
      phone,
      notes,
      turnstileToken: "",
    }),
  });

  const data = (await res.json()) as Record<string, unknown>;

  if (!res.ok) {
    const err = data.error as { message?: string } | undefined;
    return {
      success: false,
      message: err?.message ?? `Booking failed (${res.status})`,
    };
  }

  return { success: true, message: `Booking created for ${name} at slot ${slotId}!` };
}
