"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Login failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--color-linen)" }}
    >
      <div className="w-full max-w-sm px-8">
        {/* Brand */}
        <div className="text-center mb-12">
          <p
            className="tracking-[0.22em] text-[#3D2E22] text-sm mb-1"
            style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 400 }}
          >
            EXHALE
          </p>
          <p
            className="tracking-[0.12em] text-[0.6rem] text-[#9B8F84]"
            style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300 }}
          >
            ADMIN
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label
              style={{
                fontFamily: "Jost",
                fontWeight: 400,
                fontSize: "0.7rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: "var(--color-taupe-light)",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                fontFamily: "Jost",
                fontWeight: 300,
                fontSize: "0.9375rem",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(184,144,128,0.45)",
                color: "var(--color-espresso)",
                padding: "0.625rem 0",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "Jost",
                fontWeight: 400,
                fontSize: "0.7rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: "var(--color-taupe-light)",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                fontFamily: "Jost",
                fontWeight: 300,
                fontSize: "0.9375rem",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(184,144,128,0.45)",
                color: "var(--color-espresso)",
                padding: "0.625rem 0",
                width: "100%",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: "Jost",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "var(--color-candle)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 uppercase transition-all disabled:opacity-60"
            style={{
              fontFamily: "Jost",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              background: "var(--color-espresso)",
              color: "#FAF7F2",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
