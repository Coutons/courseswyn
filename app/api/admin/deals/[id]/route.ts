import { NextResponse } from "next/server";
import { getDealById, requireAdmin, updateDeal, deleteDeal } from "@/lib/store";
import type { Deal } from "@/types/deal";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Unauthorized" }, { status: 401 });
  }

  const deal = await getDealById(params.id);
  if (!deal) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Unauthorized" }, { status: 401 });
  }

  let body: Partial<Deal>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const updated = await updateDeal(params.id, {
      ...body,
      coupon: body.coupon !== undefined ? (String(body.coupon).trim() || null) : undefined,
      price: body.price != null ? Number(body.price) : undefined,
      originalPrice: body.originalPrice != null ? Number(body.originalPrice) : undefined,
      rating: body.rating != null ? Number(body.rating) : undefined,
      students: body.students != null ? Number(body.students) : undefined,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.message === "Not found") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: error?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteDeal(params.id);
  } catch (error: any) {
    if (error?.message === "Not found") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: error?.message || "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
