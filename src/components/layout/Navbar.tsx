"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaStore,
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { api } from "@/lib/api";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/categories", label: "الفئات" },
  { href: "/brands", label: "الماركات" },
];

export default function Navbar({
  isLoggedIn,
  cartCount,
}: {
  isLoggedIn: boolean;
  cartCount: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = isLoggedIn
    ? [...links, { href: "/orders", label: "طلباتي" }]
    : links;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive(href)
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    setOpen(false);
    router.push(`/products?search=${encodeURIComponent(query)}`);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
      router.push("/login");
      router.refresh();
    } catch {
      // لو فشل الطلب نفضل في الصفحة وما نحوّلش المستخدم
    } finally {
      setOpen(false);
      setLoggingOut(false);
    }
  }

  const searchBox = (
    <form onSubmit={handleSearch} className="relative w-full lg:w-64">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="ابحث عن منتج..."
        className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 ps-4 pe-10 text-sm outline-none focus:border-blue-500 focus:bg-white"
      />
      <button
        type="submit"
        aria-label="بحث"
        className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
      >
        <FaSearch />
      </button>
    </form>
  );

  const authAction = (extra: string) =>
    isLoggedIn ? (
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className={`flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 ${extra}`}
      >
        <FaSignOutAlt />
        تسجيل الخروج
      </button>
    ) : (
      <Link
        href="/login"
        onClick={() => setOpen(false)}
        className={`flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 ${extra}`}
      >
        <FaSignInAlt />
        تسجيل الدخول
      </Link>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4">
        {/* اللوجو (يمين) */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <FaStore />
          متجري
        </Link>

        {/* باقي العناصر (شمال) */}
        <div className="ms-auto flex items-center gap-4">
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">{searchBox}</div>

          <Link
            href="/cart"
            aria-label="السلة"
            className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
          >
            <FaShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <div className="hidden lg:block">{authAction("")}</div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
            aria-expanded={open}
            className="rounded-lg p-2 text-xl text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* قائمة الموبايل */}
      {open && (
        <div className="space-y-4 border-t border-gray-200 bg-white px-4 py-4 lg:hidden">
          {searchBox}
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block ${linkClass(link.href)}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {authAction("w-full")}
        </div>
      )}
    </header>
  );
}
