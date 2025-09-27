"use client";
import { useEffect, useMemo, useState } from "react";

type Deal = {
  id: string;
  slug?: string;
  title: string;
  provider: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  students?: number;
  coupon?: string | null;
  url: string;
  category?: string;
  expiresAt?: string;
};

const envDefaultToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
const DEFAULT_ADMIN_TOKEN =
  (typeof envDefaultToken === "string" && envDefaultToken.trim()) ||
  (process.env.NODE_ENV !== "production" ? "dev-admin" : "");

export default function AdminDealsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Deal[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const saved = localStorage.getItem("coursespeak:adminToken");
    if (saved) {
      setToken(saved);
      return;
    }
    if (DEFAULT_ADMIN_TOKEN) {
      localStorage.setItem("coursespeak:adminToken", DEFAULT_ADMIN_TOKEN);
      setToken(DEFAULT_ADMIN_TOKEN);
    }
  }, []);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (token) h["x-admin-token"] = token;
    return h;
  }, [token]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));
      const res = await fetch(`/api/admin/deals?${params.toString()}`, { headers });
      if (res.status === 401) throw new Error("Unauthorized: set admin token");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, page, pageSize]);

  function onSetToken() {
    const t = prompt("Enter ADMIN_PASSWORD token", token || DEFAULT_ADMIN_TOKEN || "");
    if (!t) return;
    localStorage.setItem("coursespeak:adminToken", t);
    setToken(t);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this deal?")) return;
    try {
      const res = await fetch(`/api/admin/deals/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      await load();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  }

  function slugify(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function onCreateQuick() {
    const title = prompt("Title?") || "Untitled";
    const url = prompt("Udemy URL?") || "#";
    const provider = prompt("Provider? (Udemy/Coursera)") || "Udemy";
    const priceStr = prompt("Price? (0 for Free)") || "0";
    const price = Number(priceStr) || 0;
    const slug = slugify(title);
    try {
      const res = await fetch(`/api/admin/deals`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title, url, provider, price, slug }),
      });
      if (!res.ok) throw new Error(`Create failed (${res.status})`);
      await load();
    } catch (e: any) {
      alert(e?.message || "Create failed");
    }
  }

  return (
    <div>
      <h2>Deals</h2>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title/provider/category"
          style={{ padding: 8, borderRadius: 8, border: "1px solid #1f2330", background: "#0f1320", color: "#e6e9f2" }}
        />
        <button className="pill" onClick={() => { setPage(1); load(); }}>Search</button>
        <button className="pill" onClick={() => { setQ(""); setPage(1); load(); }}>Clear</button>
        <span style={{ marginLeft: "auto" }} />
        <button className="pill" onClick={onCreateQuick}>New Deal</button>
        <button className="pill" onClick={onSetToken}>{token ? "Change Token" : "Set Token"}</button>
        {!token && DEFAULT_ADMIN_TOKEN && (
          <span className="muted">Dev default token: {DEFAULT_ADMIN_TOKEN}</span>
        )}
      </div>
      {error && <div style={{ color: "#f87171", marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>Title</th>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>Provider</th>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>Price</th>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>Coupon</th>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>Category</th>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>Expires</th>
                <th style={{ padding: 8, borderBottom: "1px solid #1f2330" }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.id}>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>{d.title}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>{d.provider}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>{d.price === 0 ? "Free" : `$${d.price.toFixed(2)}`}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>{d.coupon || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>{d.category || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330" }}>{d.expiresAt ? new Date(d.expiresAt).toLocaleString() : "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #1f2330", display: "flex", gap: 8 }}>
                    <a className="pill" href={`/deal/${d.slug || d.id}`} target="_blank" rel="noreferrer">View</a>
                    <a className="pill" href={`/admin/deals/${d.id}/edit`}>Edit</a>
                    <button className="pill" onClick={() => onDelete(d.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
        {Array.from({ length: Math.max(1, Math.ceil(total / pageSize)) }).map((_, i) => (
          <button key={i} className="pill" style={{ background: i + 1 === page ? "#151a28" : undefined }} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
