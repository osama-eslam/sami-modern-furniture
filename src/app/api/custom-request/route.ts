import { NextResponse } from "next/server";
import { isValidEgPhone } from "@/lib/utils";
import { clean, forwardForm, isFormConfigured } from "@/services/forms.server";

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
const FIELDS = ["room", "style", "width", "length", "ceiling", "color", "material", "budget", "notes", "name", "phone", "whatsapp", "locale"];

export async function POST(request: Request) {
  // Check before reading the (possibly large) multipart body.
  if (!isFormConfigured("custom")) return NextResponse.json({ error: "not_configured" }, { status: 501 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const out = new FormData();
  for (const f of FIELDS) out.append(f, clean(form.get(f), f === "notes" ? 3000 : 200));
  if (!out.get("name") || !isValidEgPhone(String(out.get("phone")))) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return NextResponse.json({ error: "too_many_files" }, { status: 400 });
  for (const file of files) {
    if (file.size > MAX_SIZE || !ALLOWED.includes(file.type)) return NextResponse.json({ error: "invalid_file" }, { status: 400 });
    out.append("files", file, file.name.replace(/[^\w.\-]/g, "_").slice(0, 80));
  }

  const result = await forwardForm("custom", out);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
