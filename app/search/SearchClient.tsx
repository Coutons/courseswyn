"use client";

import { useEffect, useMemo, useState } from "react";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/types/deal";

const PRIMARY_KEYWORD = "Udemy courses";

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetch("/api/deals?page=1&pageSize=100")
      .then((response) => response.json())
      .then((data) => setDeals(data.items ?? []))
      .catch(() => setDeals([]));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return deals;
    return deals.filter((deal) => {
      const title = deal.title.toLowerCase();
      const provider = deal.provider.toLowerCase();
      const category = (deal.category ?? "").toLowerCase();
      const slug = (deal.slug ?? "").toLowerCase();
      return (
        title.includes(term) ||
        provider.includes(term) ||
        category.includes(term) ||
        slug.includes(term)
      );
    });
  }, [q, deals]);

  return (
    <div>
      <h1 style={{ marginBottom: 12 }}>Explore {PRIMARY_KEYWORD} Deals</h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Discover the best {PRIMARY_KEYWORD} complete with coupons, discounts, and fresh promos to
        accelerate your online learning journey.
      </p>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search Udemy courses, coupon codes, or specific categories..."
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #1f2330",
          background: "#0f1320",
          color: "#e6e9f2",
          marginBottom: 16,
        }}
        aria-label="Search Udemy courses"
      />
      <div className="grid">
        {filtered.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
