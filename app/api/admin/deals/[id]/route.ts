import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDealById, updateDeal, deleteDeal } from "@/lib/store";
import type { Deal } from "@/types/deal";
import { requireAdmin } from "@/lib/auth";

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ message }, { status: 401 });
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return unauthorized(e?.message);
  }

  const deal = await getDealById(params.id);
  if (!deal) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return unauthorized(e?.message);
  }

  let body: Partial<Deal>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const patch: Partial<Deal> = {};

    const keys = Object.keys(body ?? {}) as (keyof Deal)[];
    for (const key of keys) {
      const value = body[key];
      switch (key) {
        case "coupon": {
          if (value === null) {
            patch.coupon = null;
          } else {
            const trimmed = String(value ?? "").trim();
            patch.coupon = trimmed.length ? trimmed : null;
          }
          break;
        }
        case "price": {
          patch.price = value != null ? Number(value) : undefined;
          break;
        }
        case "originalPrice": {
          patch.originalPrice = value != null ? Number(value) : undefined;
          break;
        }
        case "rating": {
          patch.rating = value != null ? Number(value) : undefined;
          break;
        }
        case "students": {
          patch.students = value != null ? Number(value) : undefined;
          break;
        }
        case "id":
        case "createdAt":
        case "updatedAt": {
          break;
        }
        default: {
          if (value !== undefined) {
            (patch as Record<string, unknown>)[key as string] = value as unknown;
          }
          break;
        }
      }
    }

    patch.updatedAt = new Date().toISOString();

    const updated = await updateDeal(params.id, patch);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.message === "Not found") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ message: error?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return unauthorized(e?.message);
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
