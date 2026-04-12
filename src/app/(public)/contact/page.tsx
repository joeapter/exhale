import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to the EXHALE team. We're here for questions, collaborations, and waitlist inquiries.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #EDE4D8 0%, #E0D0BC 60%, #D4C0A8 100%)",
          paddingTop: "calc(var(--section) + 4rem)",
          paddingBottom: "var(--section)",
        }}
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(180deg, rgba(250,245,238,0.5) 0%, transparent 100%)" }} />
        </div>

        <div
          className="relative z-10 max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">Get in Touch</span>
          </div>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#3D2E22",
            }}
          >
            Say
            <br />
            <span style={{ fontStyle: "italic" }}>Hello</span>
          </h1>
        </div>
      </section>

      {/* Contact content */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-16"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          {/* Left */}
          <div className="md:col-span-4">
            <div className="prose-exhale space-y-5 mb-12">
              <p>
                Whether you have a question about an upcoming retreat, want to
                talk through whether EXHALE is right for you, or have something
                else on your mind — we would love to hear from you.
              </p>
              <p>
                We respond to all messages personally, within 2 business days.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="label-sm text-[#B89080] mb-1.5">Email</div>
                <a
                  href="mailto:hello@exhale.co.il"
                  className="transition-colors duration-300 hover:text-[#B89080]"
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.9375rem",
                    color: "var(--color-taupe)",
                  }}
                >
                  hello@exhale.co.il
                </a>
              </div>

              <div>
                <div className="label-sm text-[#B89080] mb-1.5">Instagram</div>
                <a
                  href="https://instagram.com/exhale.desert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-[#B89080]"
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.9375rem",
                    color: "var(--color-taupe)",
                  }}
                >
                  @exhale.desert
                </a>
              </div>

              <div>
                <div className="label-sm text-[#B89080] mb-1.5">Location</div>
                <p
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.9375rem",
                    color: "var(--color-taupe)",
                    lineHeight: 1.7,
                  }}
                >
                  The Negev Desert, Israel
                </p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-7 md:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
