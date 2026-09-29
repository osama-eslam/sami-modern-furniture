/**
 * Browser-side API client. All network calls from components go through here.
 */
import type { Order, OrderDraft } from "@/types/commerce";

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(url: string, init: RequestInit): Promise<Result<T>> {
  try {
    const res = await fetch(url, init);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body?.error ?? `http_${res.status}` };
    return { ok: true, data: body as T };
  } catch {
    return { ok: false, error: "network" };
  }
}

const json = (data: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

export const api = {
  placeOrder: (draft: OrderDraft) =>
    request<{ order: Order; payment: { kind: "none" } | { kind: "redirect"; url: string } }>("/api/orders", json(draft)),
  trackOrder: (number: string, contact: string) =>
    request<{ order: Order }>(`/api/orders/track?number=${encodeURIComponent(number)}&contact=${encodeURIComponent(contact)}`, { method: "GET" }),
  subscribe: (email: string, locale: string) => request<{ ok: true }>("/api/newsletter", json({ email, locale })),
  contact: (data: Record<string, string>) => request<{ ok: true }>("/api/contact", json(data)),
  customRequest: (form: FormData) => request<{ ok: true }>("/api/custom-request", { method: "POST", body: form }),
};
