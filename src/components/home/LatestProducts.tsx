import Link from "next/link";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { getProducts } from "@/services/products";
import type { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

export default async function LatestProducts() {
  let products: Product[] | null = null;

  try {
    const result = await getProducts({ sort: "newest", limit: 8 });
    products = result.products;
  } catch {
    products = null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">أحدث المنتجات</h2>
        <Link
          href="/products"
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          عرض الكل <FaArrowLeft className="text-xs" />
        </Link>
      </div>

      {!products ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-12 text-red-600">
          <FaExclamationTriangle className="text-3xl" />
          <p className="font-semibold">تعذر تحميل المنتجات</p>
        </div>
      ) : products.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 py-12 text-center text-gray-500">
          لا توجد منتجات حاليًا
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
