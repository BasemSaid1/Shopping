import SiteShell from "@/components/layout/SiteShell";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`#app-loader{display:none}`}</style>
      <SiteShell>{children}</SiteShell>
    </>
  );
}
