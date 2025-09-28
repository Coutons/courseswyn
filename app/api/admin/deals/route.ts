import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createDeal, readDeals } from "@/lib/store";
import type { Deal } from "@/types/deal";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ message }, { status: 401 });
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return unauthorizedResponse(e?.message);
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
  const supabase = getSupabaseAdmin();

  if (supabase) {
    try {
      const query = supabase.from("deals").select("*", { count: "estimated" });
      if (q) {
        query.or(
          ["title", "provider", "category"].map((col) => `${col}.ilike.%${q}%`).join(",")
        );
      }
      query
        .order("createdAt", { ascending: false })
        .order("updatedAt", { ascending: false });
      query.range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;
      if (!error) {
        return NextResponse.json({
          items: (data as Deal[]) || [],
          total: count ?? ((data as Deal[])?.length || 0),
          page,
          pageSize,
          totalPages: Math.max(1, Math.ceil((count ?? data?.length ?? 0) / pageSize)),
        });
      }
      console.error("Supabase admin GET error", error);
    } catch (error) {
      console.error("Supabase admin GET exception", error);
    }
  }

  const all = await readDeals();
  const filtered = q
    ? all.filter((d) =>
        [d.title, d.provider, d.category]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      )
    : all;
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return NextResponse.json({ items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
  } catch (e: any) {
    return unauthorizedResponse(e?.message);
  }

  let body: Partial<Deal>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const nowId = Date.now().toString();
  const id = (body.id && String(body.id)) || nowId;
  const deal: Deal = {
    id,
    title: body.title || "Untitled",
    provider: body.provider || "Udemy",
    slug: body.slug || undefined,
    price: Number(body.price ?? 0),
    originalPrice: body.originalPrice != null ? Number(body.originalPrice) : undefined,
    rating: body.rating != null ? Number(body.rating) : undefined,
    students: body.students != null ? Number(body.students) : undefined,
    coupon: body.coupon ?? null,
    url: body.url || "#",
    category: body.category || "General",
    subcategory: body.subcategory || undefined,
    expiresAt: body.expiresAt || undefined,
    image: body.image || undefined,
    description: body.description || undefined,
    content: body.content || undefined,
    faqs: body.faqs || undefined,
    subtitle: body.subtitle || undefined,
    learn: body.learn || undefined,
    requirements: body.requirements || undefined,
    curriculum: body.curriculum || undefined,
    instructor: body.instructor || undefined,
    duration: body.duration || undefined,
    language: body.language || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  try {
    const created = await createDeal(deal);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Failed to create deal" }, { status: error?.message === "ID already exists" ? 409 : 500 });
  }
}
