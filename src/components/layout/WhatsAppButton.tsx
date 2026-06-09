"use client";

import Image from "next/image";

const PHONE = "972587280062";
const MESSAGE = "Hi! I came across the EXHALE Desert Escape and I'd love to learn more.";
const HREF = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

export default function WhatsAppButton() {
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 60,
        width: 56,
        height: 56,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-linen)",
        boxShadow: "0 4px 20px rgba(61,46,34,0.18)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 28px rgba(61,46,34,0.26)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(61,46,34,0.18)";
      }}
    >
      <Image
        src="/assets/whatsapp logo.png"
        alt="WhatsApp"
        width={34}
        height={34}
        className="object-contain"
      />
    </a>
  );
}
