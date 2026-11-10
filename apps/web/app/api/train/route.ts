import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const baseUrl = process.env.NEUROFORGE_API_URL;
  if (!baseUrl) return NextResponse.json({ error: "Training API is not configured. Set NEUROFORGE_API_URL." }, { status: 503 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const upstream = await fetch(new URL("/v1/train", baseUrl), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), signal: controller.signal, cache: "no-store",
    });
    const payload = await upstream.json();
    return NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json({ error: "Training service is unavailable or timed out." }, { status: 502 });
  } finally { clearTimeout(timeout); }
}
