import Link from "next/link";
import { FaShoppingBag, FaThLarge } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="bg-gradient-to-l from-blue-700 via-blue-600 to-indigo-600 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
          كل اللي محتاجه في مكان واحد
        </h1>
        <p className="max-w-2xl text-base text-blue-100 md:text-lg">
          تسوّق أحدث المنتجات من أفضل الماركات بأسعار مناسبة، ودفع آمن وتوصيل
          سريع لحد باب بيتك.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow transition hover:bg-blue-50"
          >
            <FaShoppingBag /> تسوّق الآن
          </Link>
          <Link
            href="/categories"
            className="flex items-center gap-2 rounded-xl border border-white/60 px-6 py-3 font-bold text-white transition hover:bg-white/10"
          >
            <FaThLarge /> تصفح الفئات
          </Link>
        </div>
      </div>
    </section>
  );
}
