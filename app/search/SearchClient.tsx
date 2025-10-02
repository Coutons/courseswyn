"use client";

import { useEffect, useMemo, useState } from "react";
import DealsList from "@/components/DealsList";

type Deal = {
  id: string | number;
};

type DealsResponse = {
  items?: Deal[];
  page?: number;
  totalPages?: number;
};

function readSearchParams(search?: string): Record<string, string> {
  const source = typeof search === "string" ? search : typeof window === "undefined" ? "" : window.location.search;
  if (!source) return {};
  const params = new URLSearchParams(source);
  const entries: Record<string, string> = {};
  params.forEach((value, key) => {
    entries[key] = value;
  });
  return entries;
}

export default function SearchClient() {
  const [items, setItems] = useState<Deal[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const locationSearch = typeof window !== "undefined" ? window.location.search : "";

  const baseParams = useMemo(() => {
    const params = readSearchParams(locationSearch);
    if (!params.pageSize) params.pageSize = "12";
    return params;
  }, [locationSearch]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams(baseParams);
        params.set("page", "1");
        const res = await fetch(`/api/deals?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load deals");
        const data: DealsResponse = await res.json();
        if (cancelled) return;
        setItems(data.items ?? []);
        setPage(data.page ?? 1);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setItems([]);
          setPage(1);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [baseParams]);

  if (loading) {
    return <div style={{ padding: 16 }}>Loading deals…</div>;
  }

  const hasResults = (items?.length ?? 0) > 0;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {!hasResults && (
        <div className="card" style={{ padding: 0 }}>
          <div className="card-body" style={{ display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>No coupons found for this search</h2>
            <p className="muted" style={{ margin: 0 }}>
              Try broadening your keywords, removing filters, or explore these quick links to get back on track.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/udemy-coupons" className="pill">Udemy coupons hub</a>
              <a href="/?provider=udemy&freeOnly=1" className="pill">100% off coupons</a>
              <a href="/categories" className="pill">Browse categories</a>
            </div>
          </div>
        </div>
      )}
      <DealsList
        initialItems={items}
        initialPage={page}
        totalPages={totalPages}
        baseParams={baseParams}
      />
    </div>
  );
}
