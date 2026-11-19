import { Suspense } from "react";
import Footer from "./Footer";
import AuthNavbar from "./AuthNavbar";
import NavbarSkeleton from "./NavbarSkeleton";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarSkeleton />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
