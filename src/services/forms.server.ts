import "server-only";
/**
 * Generic forwarding for form submissions (contact, custom request,
 * newsletter). Each form has its own env var; when it is missing the API
 * answers `not_configured` and the UI offers WhatsApp instead — nothing is
 * silently dropped or faked.
 */

export type FormKind = "contact" | "custom" | "newsletter";

const endpoints: Record<FormKind, string | undefined> = {
  contact: process.env.CONTACT_WEBHOOK_URL ?? process.env.FORMS_WEBHOOK_URL,
  custom: process.env.CUSTOM_REQUEST_WEBHOOK_URL ?? process.env.FORMS_WEBHOOK_URL,
  newsletter: process.env.NEWSLETTER_WEBHOOK_URL,
};

export const isFormConfigured = (kind: FormKind) => Boolean(endpoints[kind]);

export async function forwardForm(kind: FormKind, payload: Record<string, unknown> | FormData) {
  const url = endpoints[kind];
  if (!url) return { ok: false as const, error: "not_configured" as const };
  const isForm = payload instanceof FormData;
  if (isForm) payload.append("type", kind);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(process.env.FORMS_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.FORMS_WEBHOOK_SECRET } : {}),
    },
    body: isForm ? payload : JSON.stringify({ type: kind, ...payload, at: new Date().toISOString() }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  return res?.ok ? { ok: true as const } : { ok: false as const, error: "delivery_failed" as const };
}

/** Strip control characters and trim — form text is later rendered by third parties. */
export const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "";
