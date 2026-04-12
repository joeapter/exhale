import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <AdminNav />
      <main className="pt-16">{children}</main>
    </div>
  );
}
