import React from "react";
// Global CSS is already imported in the root layout (app/layout.tsx).

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container" style={{ justifyContent: "space-between" }}>
          <h1>Admin</h1>
          <nav>
            <a href="/admin/deals">Deals</a>
            <a href="/">View Site</a>
          </nav>
        </div>
      </header>
      <div className="container">{children}</div>
    </>
  );
}
