"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const fieldStyle = {
    fontFamily: "Jost, system-ui, sans-serif",
    fontWeight: 300 as const,
    fontSize: "0.9375rem",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(184,144,128,0.45)",
    color: "var(--color-espresso)",
    padding: "0.625rem 0",
    width: "100%",
    outline: "none",
    borderRadius: 0,
    transition: "border-color 0.3s ease",
  };

  const labelStyle = {
    fontFamily: "Jost, system-ui, sans-serif",
    fontWeight: 400 as const,
    fontSize: "0.7rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "var(--color-taupe-light)",
    display: "block",
    marginBottom: "0.25rem",
  };

  if (status === "success") {
    return (
      <div className="py-16 text-center">
        <div
          className="mx-auto mb-8"
          style={{
            width: "1px",
            height: "3rem",
            background: "linear-gradient(180deg, transparent 0%, var(--color-clay) 100%)",
            opacity: 0.5,
          }}
        />
        <h2
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            color: "var(--color-espresso)",
            marginBottom: "1rem",
          }}
        >
          Thank you.
        </h2>
        <p
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "0.9375rem",
            color: "var(--color-taupe)",
            lineHeight: 1.8,
          }}
        >
          We've received your message and will be in touch within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <label style={labelStyle}>Your name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="First and last name"
            style={fieldStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email address *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            style={fieldStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Subject</label>
        <select
          name="subject"
          value={form.subject}
          onChange={handleChange}
          style={{ ...fieldStyle, appearance: "none" as const }}
        >
          <option value="">Please select…</option>
          <option value="retreat-question">Question about a retreat</option>
          <option value="booking-help">Help with a booking</option>
          <option value="waitlist">Join the waitlist</option>
          <option value="partnership">Partnership or collaboration</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>Your message *</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Write as much or as little as you'd like…"
          style={{ ...fieldStyle, resize: "none" as const }}
        />
      </div>

      {status === "error" && (
        <p
          style={{
            fontFamily: "Jost",
            fontWeight: 300,
            fontSize: "0.8125rem",
            color: "var(--color-candle)",
          }}
        >
          Something went wrong. Please try again or email us directly at hello@exhale.co.il.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 transition-all duration-300 uppercase disabled:opacity-60"
        style={{
          fontFamily: "Jost, system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          background: "var(--color-espresso)",
          color: "#FAF7F2",
          border: "none",
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
