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

function readSearchParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
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

  const baseParams = useMemo(() => {
    const params = readSearchParams();
    if (!params.pageSize) params.pageSize = "12";
    return params;
  }, [typeof window === "undefined" ? undefined : window.location.search]);

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

  return (
    <DealsList
      initialItems={items}
      initialPage={page}
      totalPages={totalPages}
      baseParams={baseParams}
    />
  );
}
