import { NextResponse } from "next/server";
import { readDeals, writeDeals, requireAdmin } from "@/lib/store";
import type { Deal } from "@/types/deal";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try { requireAdmin(req); } catch (e: any) { return NextResponse.json({ message: e?.message || "Unauthorized" }, { status: 401 }); }
  const all = await readDeals();
  const d = all.find((x) => x.id === params.id);
  if (!d) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(d);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { requireAdmin(req); } catch (e: any) { return NextResponse.json({ message: e?.message || "Unauthorized" }, { status: 401 }); }
  let body: Partial<Deal>;
  try { body = await req.json(); } catch { return NextResponse.json({ message: "Invalid JSON" }, { status: 400 }); }
  const all = await readDeals();
  const idx = all.findIndex((x) => x.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const prev = all[idx];
  const next: Deal = {
    ...prev,
    ...body,
    id: prev.id,
    updatedAt: new Date().toISOString(),
    coupon: body.coupon !== undefined ? (String(body.coupon).trim() || null) : prev.coupon,
    price: body.price != null ? Number(body.price) : prev.price,
    originalPrice: body.originalPrice != null ? Number(body.originalPrice) : prev.originalPrice,
    rating: body.rating != null ? Number(body.rating) : prev.rating,
    students: body.students != null ? Number(body.students) : prev.students,
  };
  all[idx] = next;
  await writeDeals(all);
  return NextResponse.json(next);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try { requireAdmin(req); } catch (e: any) { return NextResponse.json({ message: e?.message || "Unauthorized" }, { status: 401 }); }
  const all = await readDeals();
  const next = all.filter((x) => x.id !== params.id);
  if (next.length === all.length) return NextResponse.json({ message: "Not found" }, { status: 404 });
  await writeDeals(next);
  return NextResponse.json({ ok: true });
}
