import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
