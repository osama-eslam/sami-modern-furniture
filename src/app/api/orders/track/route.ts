import { NextResponse } from "next/server";

/**
 * Order tracking lookup. When ORDER_TRACKING_URL is configured, the request is
 * proxied to that backend (expected to return `{ order }` for a matching
 * number + phone/email). Otherwise the client falls back to orders stored on
 * the customer's own device.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = (searchParams.get("number") ?? "").trim().slice(0, 40);
  const contact = (searchParams.get("contact") ?? "").trim().slice(0, 160);
  if (!number || !contact) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const backend = process.env.ORDER_TRACKING_URL;
  if (!backend) return NextResponse.json({ error: "not_configured" }, { status: 501 });

  const url = new URL(backend);
  url.searchParams.set("number", number);
  url.searchParams.set("contact", contact);
  const res = await fetch(url, {
    headers: process.env.ORDER_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ORDER_WEBHOOK_SECRET } : {},
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  }).catch(() => null);
  if (!res) return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  if (res.status === 404) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!res.ok) return NextResponse.json({ error: "backend_error" }, { status: 502 });
  return NextResponse.json(await res.json());
}
