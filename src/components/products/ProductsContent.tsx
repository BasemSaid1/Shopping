import Link from "next/link";
import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
import { getProducts } from "@/services/products";
import type { ProductsResult } from "@/types";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import Pagination from "./Pagination";

type RawParams = Record<string, string | string[] | undefined>;

const SORTS = ["newest", "oldest", "price_asc", "price_desc"] as const;
const MONGO_ID = /^[a-f\d]{24}$/i;

const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

const toNumber = (v?: string) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export default async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<RawParams>;
}) {
  const raw = await searchParams;

  const search = first(raw.search);
  const categoryRaw = first(raw.category);
  const brandRaw = first(raw.brand);
  const category =
    categoryRaw && MONGO_ID.test(categoryRaw) ? categoryRaw : undefined;
  const brand = brandRaw && MONGO_ID.test(brandRaw) ? brandRaw : undefined;
  const sort = SORTS.find((s) => s === first(raw.sort)) ?? "newest";
  const minPrice = toNumber(first(raw.minPrice));
  const maxPrice = toNumber(first(raw.maxPrice));
  const inStock = first(raw.inStock) === "true" ? true : undefined;
  const pageNumber = Number(first(raw.page));
  const page = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  // الباراميترات اللي بتتحفظ لما المستخدم يطبّق فلاتر جديدة
  const preserved: Record<string, string> = {};
  if (search) preserved.search = search;
  if (category) preserved.category = category;
  if (brand) preserved.brand = brand;

  // الباراميترات اللي بتتحفظ في روابط الصفحات
  const baseParams: Record<string, string> = { ...preserved };
  if (sort !== "newest") baseParams.sort = sort;
  if (minPrice !== undefined) baseParams.minPrice = String(minPrice);
  if (maxPrice !== undefined) baseParams.maxPrice = String(maxPrice);
  if (inStock) baseParams.inStock = "true";

  let result: ProductsResult | null = null;
  try {
    result = await getProducts({
      search,
      category,
      brand,
      sort,
      minPrice,
      maxPrice,
      inStock,
      page,
      limit: 12,
    });
  } catch {
    result = null;
  }

  return (
    <>
      <ProductFilters
        preserved={preserved}
        initial={{
          sort,
          minPrice: minPrice !== undefined ? String(minPrice) : "",
          maxPrice: maxPrice !== undefined ? String(maxPrice) : "",
          inStock: Boolean(inStock),
        }}
      />

      {search && (
        <p className="mb-4 text-sm text-gray-600">
          نتائج البحث عن “<strong className="text-gray-800">{search}</strong>”
          {" — "}
          <Link href="/products" className="font-semibold text-blue-600">
            مسح البحث
          </Link>
        </p>
      )}

      {!result ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
          <FaExclamationTriangle className="text-4xl" />
          <p className="font-semibold">تعذر تحميل المنتجات، حاول مرة أخرى</p>
        </div>
      ) : result.products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 py-16 text-gray-500">
          <FaBoxOpen className="text-5xl" />
          <p className="font-semibold">مفيش منتجات مطابقة</p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            {result.pagination.total.toLocaleString("ar-EG")} منتج
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {result.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination
            page={result.pagination.page}
            totalPages={result.pagination.totalPages}
            baseParams={baseParams}
          />
        </>
      )}
    </>
  );
}
