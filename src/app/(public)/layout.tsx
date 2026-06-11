import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getSiteTheme } from "@/lib/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getSiteTheme();

  return (
    <div data-theme={theme}>
      <Nav />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
