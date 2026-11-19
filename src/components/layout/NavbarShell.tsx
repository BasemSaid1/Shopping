import Link from "next/link";
import { FaStore, FaBars, FaSearch, FaShoppingCart } from "react-icons/fa";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/categories", label: "الفئات" },
  { href: "/brands", label: "الماركات" },
];

// نسخة ثابتة من الـ navbar بتظهر فوراً (من غير hooks)، لحد ما النسخة الحقيقية تجهز
export default function NavbarShell() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <FaStore />
          متجري
        </Link>

        <div className="ms-auto flex items-center gap-4">
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <form action="/products" className="relative hidden w-64 lg:block">
            <input
              type="search"
              name="search"
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

          <Link
            href="/cart"
            aria-label="السلة"
            className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
          >
            <FaShoppingCart className="text-xl" />
          </Link>

          {/* مكان زر الدخول/الخروج (بيتحدد بعد ما نعرف حالة المستخدم) */}
          <div className="hidden h-9 w-32 rounded-lg bg-gray-100 lg:block" />

          <span className="rounded-lg p-2 text-xl text-gray-700 lg:hidden">
            <FaBars />
          </span>
        </div>
      </nav>
    </header>
  );
}