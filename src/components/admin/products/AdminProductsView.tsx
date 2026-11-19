// "use client";

// /* eslint-disable @next/next/no-img-element */

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaEdit,
//   FaImage,
//   FaPlus,
//   FaSearch,
//   FaTrash,
// } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { formatPrice } from "@/lib/format";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { getImageUrl } from "@/lib/image";
// import { useList } from "@/lib/useList";
// import type {
//   ApiResponse,
//   Brand,
//   Category,
//   Product,
//   ProductsResult,
// } from "@/types";
// import { ListEmpty, ListError } from "@/components/ListStates";
// import ConfirmDialog from "../ConfirmDialog";
// import ProductFormModal from "./ProductFormModal";
// import { getPriceRange } from "@/lib/variants";

// const PAGE_SIZE = 10;

// function StockBadge({ stock }: { stock: number }) {
//   if (stock === 0) {
//     return (
//       <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
//         نفد
//       </span>
//     );
//   }
//   return (
//     <span
//       className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
//         stock <= 5
//           ? "bg-yellow-50 text-yellow-700"
//           : "bg-green-50 text-green-700"
//       }`}
//     >
//       المخزون: {stock.toLocaleString("ar-EG")}
//     </span>
//   );
// }

// export default function AdminProductsView() {
//   const router = useRouter();
//   const { items: categories } = useList<Category>(
//     "/categories",
//     "/admin/products",
//   );
//   const { items: brands } = useList<Brand>("/brands", "/admin/products");

//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [attempt, setAttempt] = useState(0);
//   const [data, setData] = useState<ProductsResult | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [formFor, setFormFor] = useState<Product | "new" | null>(null);
//   const [deleting, setDeleting] = useState<Product | null>(null);
//   const [deleteBusy, setDeleteBusy] = useState(false);
//   const [deleteError, setDeleteError] = useState("");

//   // البحث بعد ما المستخدم يبطّل كتابة
//   useEffect(() => {
//     const t = setTimeout(() => {
//       const next = searchInput.trim();
//       if (next !== search) {
//         setLoading(true);
//         setSearch(next);
//         setPage(1);
//       }
//     }, 400);
//     return () => clearTimeout(t);
//   }, [searchInput, search]);

//   useEffect(() => {
//     let cancelled = false;

//     api
//       .get<ApiResponse<ProductsResult>>("/admin/products", {
//         params: { page, limit: PAGE_SIZE, search: search || undefined },
//       })
//       .then(({ data: res }) => {
//         if (cancelled) return;
//         setData(res.data);
//         setError("");
//       })
//       .catch((err) => {
//         if (cancelled) return;
//         if (axios.isAxiosError(err) && err.response?.status === 401) {
//           router.push("/login?redirect=/admin/products");
//           return;
//         }
//         setError(getErrorMessage(err));
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [page, search, attempt, router]);

//   function refresh() {
//     setAttempt((a) => a + 1);
//   }

//   function retry() {
//     setError("");
//     setLoading(true);
//     setAttempt((a) => a + 1);
//   }

//   function goTo(next: number) {
//     setLoading(true);
//     setPage(next);
//   }

//   async function confirmDelete() {
//     if (!deleting) return;
//     setDeleteBusy(true);
//     setDeleteError("");
//     try {
//       await api.delete(`/admin/products/${deleting._id}`);
//       setDeleting(null);
//       // لو ده كان آخر منتج في الصفحة، نرجع صفحة
//       if (data && data.products.length === 1 && page > 1) {
//         goTo(page - 1);
//       } else {
//         refresh();
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push("/login?redirect=/admin/products");
//         return;
//       }
//       setDeleteError(getErrorMessage(err));
//     } finally {
//       setDeleteBusy(false);
//     }
//   }

//   const products = data?.products ?? [];
//   const pagination = data?.pagination;

//   return (
//     <>
//       <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
//           <p className="text-sm text-gray-500">
//             {(pagination?.total ?? 0).toLocaleString("ar-EG")} منتج
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setFormFor("new")}
//           className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//         >
//           <FaPlus /> إضافة منتج
//         </button>
//       </div>

//       <div className="relative mb-5">
//         <FaSearch className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           placeholder="ابحث باسم المنتج..."
//           autoComplete="off"
//           className="w-full rounded-xl border border-gray-300 bg-white py-2.5 ps-10 pe-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />
//       </div>

//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-24 animate-pulse rounded-2xl bg-gray-100"
//             />
//           ))}
//         </div>
//       ) : error ? (
//         <ListError message={error} onRetry={retry} />
//       ) : products.length === 0 ? (
//         <ListEmpty
//           text={
//             search
//               ? "مفيش نتايج للبحث ده"
//               : "مفيش منتجات لسه، ابدأ بإضافة أول منتج"
//           }
//         />
//       ) : (
//         <ul className="space-y-3">
//           {products.map((p) => {
//             const image = getImageUrl(p.image);
//             return (
//               <li
//                 key={p._id}
//                 className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3"
//               >
//                 <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
//                   {image ? (
//                     <img
//                       src={image}
//                       alt={p.title}
//                       loading="lazy"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <FaImage className="text-2xl text-gray-300" />
//                   )}
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <p className="truncate font-bold text-gray-800">{p.title}</p>
//                   <p className="mt-0.5 truncate text-xs text-gray-500">
//                     {[p.category?.name, p.brand?.name]
//                       .filter(Boolean)
//                       .join(" • ") || "بدون فئة"}
//                   </p>
//                   <div className="mt-1.5 flex flex-wrap items-center gap-2">
//                     <span className="text-sm font-bold text-blue-600">
//                       {getPriceRange(p).min !== getPriceRange(p).max && (
//                         <span className="me-1 text-xs font-semibold text-gray-500">
//                           ابتداءً من
//                         </span>
//                       )}
//                       {formatPrice(getPriceRange(p).min)}
//                     </span>
//                     {(p.variants?.length ?? 0) > 0 && (
//                       <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
//                         {p.variants!.length.toLocaleString("ar-EG")} تركيبة
//                       </span>
//                     )}
//                     <StockBadge stock={p.stock} />
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setFormFor(p)}
//                     aria-label={`تعديل ${p.title}`}
//                     className="rounded-lg p-2.5 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setDeleteError("");
//                       setDeleting(p);
//                     }}
//                     aria-label={`حذف ${p.title}`}
//                     className="rounded-lg p-2.5 text-red-600 ring-1 ring-red-200 hover:bg-red-50"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       {pagination && pagination.totalPages > 1 && !loading && !error && (
//         <div className="mt-6 flex items-center justify-center gap-3">
//           <button
//             type="button"
//             onClick={() => goTo(page - 1)}
//             disabled={!pagination.hasPreviousPage}
//             className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
//           >
//             <FaChevronRight className="text-xs" /> السابق
//           </button>
//           <span className="text-sm text-gray-600">
//             {pagination.page.toLocaleString("ar-EG")} من{" "}
//             {pagination.totalPages.toLocaleString("ar-EG")}
//           </span>
//           <button
//             type="button"
//             onClick={() => goTo(page + 1)}
//             disabled={!pagination.hasNextPage}
//             className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
//           >
//             التالي <FaChevronLeft className="text-xs" />
//           </button>
//         </div>
//       )}

//       {formFor && (
//         <ProductFormModal
//           product={formFor === "new" ? null : formFor}
//           categories={categories}
//           brands={brands}
//           onClose={() => setFormFor(null)}
//           onSaved={() => {
//             setFormFor(null);
//             refresh();
//           }}
//         />
//       )}

//       {deleting && (
//         <ConfirmDialog
//           title="حذف المنتج"
//           message={`هل تريد حذف "${deleting.title}"؟ هتتمسح صوره كمان ولا يمكن التراجع.`}
//           busy={deleteBusy}
//           error={deleteError}
//           onConfirm={confirmDelete}
//           onClose={() => setDeleting(null)}
//         />
//       )}
//     </>
//   );
// }

"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaImage,
  FaPlus,
  FaSearch,
  FaTrash,
  FaBoxOpen,
  FaTag,
  FaLayerGroup,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { useList } from "@/lib/useList";
import type {
  ApiResponse,
  Brand,
  Category,
  Product,
  ProductsResult,
} from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";
import ProductFormModal from "./ProductFormModal";
import { getPriceRange } from "@/lib/variants";

const PAGE_SIZE = 10;

function getStockInfo(product: Product) {
  const hasVariants = (product.variants?.length ?? 0) > 0;

  const stock = hasVariants
    ? product.variants!.reduce((total, variant) => total + variant.stock, 0)
    : product.stock;

  if (stock <= 0) {
    return {
      stock,
      label: "نفد من المخزون",
      color: "bg-red-50 text-red-600 border-red-100",
      dot: "bg-red-500",
      bar: "bg-red-500",
    };
  }

  if (stock <= 5) {
    return {
      stock,
      label: "مخزون منخفض",
      color: "bg-amber-50 text-amber-700 border-amber-100",
      dot: "bg-amber-500",
      bar: "bg-amber-500",
    };
  }

  return {
    stock,
    label: "متوفر",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  };
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const image = getImageUrl(product.image);
  const priceRange = getPriceRange(product);
  const stockInfo = getStockInfo(product);
  const hasVariants = (product.variants?.length ?? 0) > 0;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40">
      {/* Product Image */}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-50 p-4">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <FaImage className="text-5xl text-gray-200" />
        )}

        {/* Availability */}
        <span
          className={`absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${stockInfo.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stockInfo.dot}`} />
          {stockInfo.label}
        </span>

        {hasVariants && (
          <span className="absolute end-3 top-3 rounded-full border border-indigo-100 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-indigo-600 shadow-sm">
            {product.variants!.length.toLocaleString("ar-EG")} خيارات
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        {/* Product Name */}
        <h3
          title={product.title}
          className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-gray-800 transition-colors group-hover:text-indigo-600 sm:text-base"
        >
          {product.title}
        </h3>

        {/* Brand & Category */}
        <div className="mt-2 flex min-h-7 flex-wrap items-center gap-1.5">
          {product.brand?.name ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 sm:text-xs">
              <FaTag className="text-[9px]" />
              {product.brand.name}
            </span>
          ) : null}

          {product.category?.name ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 sm:text-xs">
              <FaLayerGroup className="text-[9px]" />
              {product.category.name}
            </span>
          ) : null}

          {!product.brand?.name && !product.category?.name && (
            <span className="text-xs text-gray-400">بدون تصنيف</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-4">
          <p className="mb-1 text-[11px] font-medium text-gray-400">
            {priceRange.min !== priceRange.max
              ? "الأسعار تبدأ من"
              : "سعر المنتج"}
          </p>

          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl">
              {formatPrice(priceRange.min)}
            </span>

            {priceRange.min !== priceRange.max && (
              <span className="text-[11px] font-medium text-gray-400">
                - {formatPrice(priceRange.max)}
              </span>
            )}
          </div>
        </div>

        {/* Stock */}
        <div className="mt-4 rounded-xl bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <FaBoxOpen className="text-gray-400" />
              الكمية المتاحة
            </span>

            <span
              className={`text-xs font-extrabold ${
                stockInfo.stock <= 0
                  ? "text-red-600"
                  : stockInfo.stock <= 5
                    ? "text-amber-600"
                    : "text-emerald-600"
              }`}
            >
              {stockInfo.stock.toLocaleString("ar-EG")} قطعة
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${stockInfo.bar}`}
              style={{
                width: `${Math.min((stockInfo.stock / 50) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-4">
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-600 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white sm:text-sm"
          >
            <FaEdit />
            تعديل
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`حذف ${product.title}`}
            className="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3.5 text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-lg bg-gray-100" />
          <div className="h-6 w-20 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="h-7 w-1/2 animate-pulse rounded bg-gray-100" />
        <div className="h-14 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}

export default function AdminProductsView() {
  const router = useRouter();

  const { items: categories } = useList<Category>(
    "/categories",
    "/admin/products",
  );

  const { items: brands } = useList<Brand>("/brands", "/admin/products");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<ProductsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formFor, setFormFor] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();

      if (next !== search) {
        setLoading(true);
        setSearch(next);
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, search]);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<ProductsResult>>("/admin/products", {
        params: {
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
        },
      })
      .then(({ data: res }) => {
        if (cancelled) return;

        setData(res.data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;

        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/products");
          return;
        }

        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, attempt, router]);

  function refresh() {
    setAttempt((value) => value + 1);
  }

  function retry() {
    setError("");
    setLoading(true);
    refresh();
  }

  function goTo(next: number) {
    setLoading(true);
    setPage(next);
  }

  async function confirmDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    setDeleteError("");

    try {
      await api.delete(`/admin/products/${deleting._id}`);

      setDeleting(null);

      if (data && data.products.length === 1 && page > 1) {
        goTo(page - 1);
      } else {
        refresh();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/products");
        return;
      }

      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">المنتجات</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة ومتابعة جميع منتجات المتجر
            <span className="mx-2 text-gray-300">•</span>
            {(pagination?.total ?? 0).toLocaleString("ar-EG")} منتج
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
        >
          <FaPlus />
          إضافة منتج جديد
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="ابحث عن منتج بالاسم..."
          autoComplete="off"
          className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 ps-11 pe-4 text-sm text-gray-800 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
        />
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : products.length === 0 ? (
        <ListEmpty
          text={
            search
              ? "مفيش نتائج للبحث ده"
              : "مفيش منتجات لسه، ابدأ بإضافة أول منتج"
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => setFormFor(product)}
              onDelete={() => {
                setDeleteError("");
                setDeleting(product);
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && !loading && !error && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronRight className="text-xs" />
            السابق
          </button>

          <span className="rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700">
            {pagination.page.toLocaleString("ar-EG")} من{" "}
            {pagination.totalPages.toLocaleString("ar-EG")}
          </span>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            التالي
            <FaChevronLeft className="text-xs" />
          </button>
        </div>
      )}

      {/* Product Form */}
      {formFor && (
        <ProductFormModal
          product={formFor === "new" ? null : formFor}
          categories={categories}
          brands={brands}
          onClose={() => setFormFor(null)}
          onSaved={() => {
            setFormFor(null);
            refresh();
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleting && (
        <ConfirmDialog
          title="حذف المنتج"
          message={`هل تريد حذف "${deleting.title}"؟ هتتمسح صورته كمان ولا يمكن التراجع.`}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
