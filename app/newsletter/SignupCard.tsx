"use client";

import { useState } from "react";

export default function NewsletterSignupCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section className="card" style={{ borderRadius: 14 }}>
      <div className="card-body" style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Get daily Udemy coupon alerts</h2>
        <p className="muted" style={{ margin: 0 }}>
          Join the Courseswyn newsletter and receive fresh Udemy coupons, 100% off codes, and trending course deals.
        </p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(0, 138, 92, 0.3)",
              background: "#081623",
              color: "#e6f6f4",
            }}
          />
          <button
            type="submit"
            className="btn"
            disabled={status === "loading"}
            style={{ justifySelf: "start" }}
          >
            {status === "loading" ? "Joining..." : "Subscribe"}
          </button>
          {status === "success" ? <span className="muted">You&apos;re on the list! Check your inbox for confirmation.</span> : null}
          {status === "error" ? <span style={{ color: "#fca5a5" }}>Failed to subscribe. Please try again.</span> : null}
        </form>
      </div>
    </section>
  );
}
