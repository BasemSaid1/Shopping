import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "متجري",
  description: "متجر إلكتروني",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased`}>
        <PageLoader />
        {children}
        <noscript>
          <style>{`#app-loader{display:none}`}</style>
        </noscript>
      </body>
    </html>
  );
}
