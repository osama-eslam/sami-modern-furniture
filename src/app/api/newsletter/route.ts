import { NextResponse } from "next/server";
import { z } from "zod";
import { forwardForm } from "@/services/forms.server";

const schema = z.object({ email: z.email().max(160), locale: z.enum(["ar", "en"]).default("ar") });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const result = await forwardForm("newsletter", parsed.data);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error === "not_configured" ? 501 : 502 });
  return NextResponse.json({ ok: true });
}
