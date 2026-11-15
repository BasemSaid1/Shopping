"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars,
  FaBoxOpen,
  FaClipboardList,
  FaCopyright,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaStore,
  FaTachometerAlt,
  FaThLarge,
  FaTicketAlt,
  FaTimes,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { api } from "@/lib/api";

const items: {
  href: string;
  label: string;
  icon: IconType;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "لوحة التحكم", icon: FaTachometerAlt, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: FaBoxOpen },
  { href: "/admin/categories", label: "الفئات", icon: FaThLarge },
  { href: "/admin/brands", label: "الماركات", icon: FaCopyright },
  { href: "/admin/coupons", label: "الكوبونات", icon: FaTicketAlt },
  { href: "/admin/orders", label: "الطلبات", icon: FaClipboardList },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
      router.push("/login");
      router.refresh();
    } catch {
      // لو فشل الطلب نفضل في الصفحة
    } finally {
      setLoggingOut(false);
    }
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5 text-xl font-bold text-blue-600">
        <FaStore />
        لوحة التحكم
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isActive(href, exact)
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon className="text-base" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-gray-200 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
        >
          <FaExternalLinkAlt className="text-base" />
          العودة للمتجر
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          <FaSignOutAlt className="text-base" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* شاشات كبيرة */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e border-gray-200 bg-white lg:block">
        {content}
      </aside>

      {/* موبايل */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2 font-bold text-blue-600">
          <FaStore />
          لوحة التحكم
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="القائمة"
          className="rounded-lg p-2 text-xl text-gray-700 hover:bg-gray-100"
        >
          <FaBars />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 start-0 w-72 max-w-[85%] bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق"
              className="absolute end-3 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            >
              <FaTimes />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
