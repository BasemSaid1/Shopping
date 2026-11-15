import Link from "next/link";
import { FaCopyright, FaThLarge } from "react-icons/fa";

export default function Explore() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12">
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/categories"
          className="group flex items-center gap-4 rounded-2xl bg-indigo-50 p-6 transition hover:shadow-md"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white">
            <FaThLarge />
          </span>
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700">
              تسوّق حسب الفئة
            </h3>
            <p className="text-sm text-gray-500">
              اكتشف المنتجات من كل الأقسام
            </p>
          </div>
        </Link>

        <Link
          href="/brands"
          className="group flex items-center gap-4 rounded-2xl bg-emerald-50 p-6 transition hover:shadow-md"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-2xl text-white">
            <FaCopyright />
          </span>
          <div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700">
              تسوّق حسب الماركة
            </h3>
            <p className="text-sm text-gray-500">
              ماركاتك المفضلة في مكان واحد
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
