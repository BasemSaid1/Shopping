import { Suspense } from "react";
import Footer from "./Footer";
import AuthNavbar from "./AuthNavbar";
import NavbarShell from "./NavbarShell";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarShell />}>
        <AuthNavbar />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
