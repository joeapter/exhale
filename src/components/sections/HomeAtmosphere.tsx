import Image from "next/image";

export default function HomeAtmosphere() {
  return (
    <section className="relative overflow-hidden" aria-label="The place">

      {/* Full-bleed photo */}
      <div className="relative overflow-hidden" style={{ minHeight: "70vh" }}>
        <Image
          src="/assets/noor/fire.webp"
          alt="Evening fire at Noor Glamping"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(20,14,8,0.1) 0%, rgba(20,14,8,0.5) 100%)",
          }}
          aria-hidden
        />

        {/* Centered text */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24 z-10">
          <div className="text-center px-8">
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                lineHeight: 1.1,
                color: "#FAF7F2",
                letterSpacing: "-0.01em",
              }}
            >
              Noor Glamping
              <br />
              <em style={{ fontStyle: "italic", opacity: 0.85 }}>Desert. South Israel.</em>
            </h2>
          </div>
        </div>
      </div>

    </section>
  );
}
