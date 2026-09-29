import { NextResponse } from "next/server";
import { createOrder, OrderError } from "@/services/orders.server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  try {
    const result = await createOrder(body);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    if (e instanceof OrderError) return NextResponse.json({ error: e.code }, { status: e.status });
    console.error("[orders] unexpected", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
