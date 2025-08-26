import { NextResponse } from 'next/server';

export async function GET() {
  const list = (process.env.ALLOWED_COUNTRIES || 'FR').split(',');
  const out: Record<string, string> = {};
  await Promise.all(list.map(async (c) => {
    const url = process.env[`HEALTHCHECK_${c}` as const];
    if (!url) { out[c] = 'N/D'; return; }
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
      out[c] = res.ok ? 'online' : `erro ${res.status}`;
    } catch {
      out[c] = 'offline';
    } finally { clearTimeout(t); }
  }));
  return NextResponse.json(out, { status: 200 });
}
