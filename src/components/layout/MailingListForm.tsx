"use client";

import { useState } from "react";

export default function MailingListForm({ source = "website" }: { source?: string }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), firstName: firstName.trim() || undefined, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const inputBase: React.CSSProperties = {
    fontFamily: "Jost, system-ui, sans-serif",
    fontWeight: 300,
    fontSize: "0.875rem",
    color: "#FAF7F2",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "10px 14px",
    outline: "none",
    width: "100%",
  };

  if (status === "success") {
    return (
      <p
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "1.125rem",
          color: "#E4D8C9",
          lineHeight: 1.6,
        }}
      >
        You&rsquo;re on the list. We&rsquo;ll be in touch when our next retreat opens.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          aria-label="First name"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          style={{ ...inputBase, flex: "0 0 auto", width: "auto", minWidth: 0 }}
          className="sm:w-36"
        />
        <input
          type="email"
          aria-label="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          style={{ ...inputBase, flex: "1 1 0", minWidth: 0 }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#3D2E22",
            background: status === "loading" ? "#9B8F84" : "#E4D8C9",
            border: "none",
            padding: "10px 20px",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          {status === "loading" ? "..." : "Notify Me"}
        </button>
      </div>
      {status === "error" && (
        <p
          className="mt-2"
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "0.8125rem",
            color: "#C9A898",
          }}
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}
