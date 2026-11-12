import { Suspense } from "react";
import Footer from "@/components/layout/Footer";
import AuthNavbar from "@/components/layout/AuthNavbar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-16" />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
