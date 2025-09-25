import { NextResponse } from "next/server";
import { readDeals } from "@/lib/store";
import type { Deal } from "@/types/deal";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const all = await readDeals();
  const key = params.id;
  const deal = all.find((d: Deal) => d.id === key || (d.slug ? d.slug === key : false));
  if (!deal) return NextResponse.json({ message: "Not Found" }, { status: 404 });
  return NextResponse.json(deal);
}
