import Link from "next/link";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { getProducts } from "@/services/products";
import type { Pagination, Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

// 7 منتجات + كارت أخير بيودّي لباقي المنتجات = 8 خانات (صفين على الديسكتوب)
const SHOWN = 7;

export default async function LatestProducts() {
  let products: Product[] | null = null;
  let pagination: Pagination | null = null;

  try {
    const result = await getProducts({ sort: "newest", limit: SHOWN });
    products = result.products;
    pagination = result.pagination;
  } catch {
    products = null;
  }

  const remaining = pagination ? Math.max(pagination.total - SHOWN, 0) : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 pt-4 lg:pb-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#101536] sm:text-4xl">
            وصل حديثاً
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            آخر المنتجات اللي اتضافت للمتجر.
          </p>
        </div>
        <Link
          href="/products"
          className="shrink-0 text-sm font-bold text-[#101536] underline decoration-2 underline-offset-8 hover:decoration-[#FF5C47]"
        >
          كل المنتجات
        </Link>
      </div>

      {!products ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-red-50 py-12 text-red-600">
          <FaExclamationTriangle className="text-3xl" />
          <p className="font-semibold">تعذر تحميل المنتجات</p>
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-3xl bg-[#f1f2f7] py-12 text-center text-gray-500">
          مفيش منتجات حالياً.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}

          {remaining > 0 && (
            <Link
              href="/products"
              className="group flex min-h-[260px] flex-col justify-between rounded-2xl bg-[#101536] p-5 text-white transition hover:bg-[#1d2459] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101536] sm:p-6"
            >
              <span
                dir="ltr"
                className="text-5xl font-black text-[#FFD93D] sm:text-6xl"
              >
                +{remaining}
              </span>
              <span>
                <span className="block text-lg font-bold leading-8">
                  {remaining === 1 ? "منتج كمان" : "منتج تانيين"} في المتجر
                </span>
                <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD93D] text-[#101536] transition group-hover:bg-[#FF5C47] group-hover:text-white">
                  <FaArrowLeft aria-hidden="true" />
                </span>
              </span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
