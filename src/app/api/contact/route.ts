import { NextResponse } from "next/server";
import { z } from "zod";
import { isValidEgPhone } from "@/lib/utils";
import { clean, forwardForm } from "@/services/forms.server";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(20).refine(isValidEgPhone),
  email: z.union([z.literal(""), z.email().max(160)]).optional(),
  type: z.enum(["product", "order", "custom", "showroom", "other"]),
  orderNumber: z.string().max(40).optional(),
  message: z.string().trim().min(1).max(3000),
  locale: z.enum(["ar", "en"]).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;
  const result = await forwardForm("contact", {
    ...d,
    name: clean(d.name, 120),
    message: clean(d.message, 3000),
    orderNumber: clean(d.orderNumber, 40),
  });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error === "not_configured" ? 501 : 502 });
  return NextResponse.json({ ok: true });
}
