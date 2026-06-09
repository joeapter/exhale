import type { Metadata } from "next";
import MailingListForm from "@/components/layout/MailingListForm";
import Nav from "@/components/layout/Nav";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Subscribe for news about upcoming EXHALE retreats.",
};

export default function SubscribePage() {
  return (
    <>
      <Nav />
      <div className="h-[5.25rem] bg-[#FAF7F2]" aria-hidden />
      <main
        className="grain-overlay flex min-h-[calc(100vh-5.25rem)] items-center justify-center"
        style={{
          background: "linear-gradient(145deg, #3D2E22 0%, #4A392B 55%, #2F241C 100%)",
          padding: "var(--gutter)",
        }}
      >
        <section className="relative z-10 w-full max-w-2xl text-center">
          <p className="label-sm text-[#B89080] mb-4">Stay in the loop</p>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
              lineHeight: 1,
              color: "#FAF7F2",
              marginBottom: "1.25rem",
            }}
          >
            Be the first to know.
          </h1>
          <p
            className="mx-auto mb-9 max-w-lg"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              lineHeight: 1.5,
              color: "#C9BAA8",
            }}
          >
            Subscribe for news about our next desert retreat.
          </p>

          <div className="mx-auto max-w-xl text-left">
            <MailingListForm source="subscribe-page" />
          </div>
        </section>
      </main>
    </>
  );
}
