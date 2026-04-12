import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EXHALE — Desert Escape for Women",
    template: "%s — EXHALE",
  },
  description:
    "A women-only luxury desert retreat in Israel. Rest, nourishment, stillness, and beauty. An intentional escape from the noise of everyday life.",
  keywords: [
    "women's retreat Israel",
    "desert retreat",
    "luxury glamping",
    "women's wellness",
    "exhale retreat",
  ],
  openGraph: {
    siteName: "EXHALE",
    locale: "en_IL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
