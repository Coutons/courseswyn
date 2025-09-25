"use client";
import { useEffect, useMemo, useState } from "react";
import DealCard from "@/components/DealCard";
import type { Deal } from "@/types/deal";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    // Fetch a larger page to have enough data for client-side filtering in this demo
    fetch("/api/deals?page=1&pageSize=100")
      .then((r) => r.json())
      .then((data) => setDeals(data.items ?? []))
      .catch(() => setDeals([]));
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return deals;
    return deals.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        d.provider.toLowerCase().includes(term) ||
        (d.category ?? "").toLowerCase().includes(term)
    );
  }, [q, deals]);

  return (
    <div>
      <h2>Search</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search deals, providers, categories..."
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #1f2330",
          background: "#0f1320",
          color: "#e6e9f2",
          marginBottom: 16,
        }}
      />
      <div className="grid">
        {filtered.map((d) => (
          <DealCard key={d.id} deal={d} />
        ))}
      </div>
    </div>
  );
}
