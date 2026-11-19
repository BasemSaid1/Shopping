// "use client";

// /* eslint-disable @next/next/no-img-element */

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { FaEdit, FaImage, FaPlus, FaTrash } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { getImageUrl } from "@/lib/image";
// import { useList } from "@/lib/useList";
// import type { Brand, Category } from "@/types";
// import { ListEmpty, ListError } from "@/components/ListStates";
// import ConfirmDialog from "../ConfirmDialog";
// import BrandFormModal from "./BrandFormModal";

// export default function AdminBrandsView() {
//   const router = useRouter();
//   const { items, loading, error, retry, refresh } = useList<Brand>(
//     "/brands",
//     "/admin/brands",
//   );
//   const { items: categories } = useList<Category>(
//     "/categories",
//     "/admin/brands",
//   );

//   const [formFor, setFormFor] = useState<Brand | "new" | null>(null);
//   const [deleting, setDeleting] = useState<Brand | null>(null);
//   const [deleteBusy, setDeleteBusy] = useState(false);
//   const [deleteError, setDeleteError] = useState("");

//   async function confirmDelete() {
//     if (!deleting) return;
//     setDeleteBusy(true);
//     setDeleteError("");
//     try {
//       await api.delete(`/admin/brands/${deleting._id}`);
//       setDeleting(null);
//       refresh();
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push("/login?redirect=/admin/brands");
//         return;
//       }
//       setDeleteError(getErrorMessage(err));
//     } finally {
//       setDeleteBusy(false);
//     }
//   }

//   return (
//     <>
//       <div className="mb-6 flex items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">الماركات</h1>
//           <p className="text-sm text-gray-500">
//             {items.length.toLocaleString("ar-EG")} ماركة
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setFormFor("new")}
//           className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//         >
//           <FaPlus /> إضافة ماركة
//         </button>
//       </div>

//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-20 animate-pulse rounded-2xl bg-gray-100"
//             />
//           ))}
//         </div>
//       ) : error ? (
//         <ListError message={error} onRetry={retry} />
//       ) : items.length === 0 ? (
//         <ListEmpty text="مفيش ماركات لسه، ابدأ بإضافة أول ماركة" />
//       ) : (
//         <ul className="space-y-3">
//           {items.map((b) => {
//             const logo = getImageUrl(b.logo);
//             return (
//               <li
//                 key={b._id}
//                 className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3"
//               >
//                 <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
//                   {logo ? (
//                     <img
//                       src={logo}
//                       alt={b.name}
//                       loading="lazy"
//                       className="h-full w-full object-contain"
//                     />
//                   ) : (
//                     <FaImage className="text-2xl text-gray-300" />
//                   )}
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="truncate font-bold text-gray-800">{b.name}</p>
//                   <div className="mt-1 flex flex-wrap gap-1">
//                     {b.categories.map((c) => (
//                       <span
//                         key={c._id}
//                         className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
//                       >
//                         {c.name}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setFormFor(b)}
//                     aria-label={`تعديل ${b.name}`}
//                     className="rounded-lg p-2.5 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setDeleteError("");
//                       setDeleting(b);
//                     }}
//                     aria-label={`حذف ${b.name}`}
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

//       {formFor && (
//         <BrandFormModal
//           brand={formFor === "new" ? null : formFor}
//           categories={categories}
//           onClose={() => setFormFor(null)}
//           onSaved={() => {
//             setFormFor(null);
//             refresh();
//           }}
//         />
//       )}

//       {deleting && (
//         <ConfirmDialog
//           title="حذف الماركة"
//           message={`هل تريد حذف ماركة "${deleting.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaEdit,
  FaImage,
  FaPlus,
  FaTrash,
  FaLayerGroup,
  FaTags,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { useList } from "@/lib/useList";
import type { Brand, Category } from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";
import BrandFormModal from "./BrandFormModal";

export default function AdminBrandsView() {
  const router = useRouter();

  const { items, loading, error, retry, refresh } = useList<Brand>(
    "/brands",
    "/admin/brands",
  );

  const { items: categories } = useList<Category>(
    "/categories",
    "/admin/brands",
  );

  const [formFor, setFormFor] = useState<Brand | "new" | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function confirmDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    setDeleteError("");

    try {
      await api.delete(`/admin/brands/${deleting._id}`);
      setDeleting(null);
      refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/brands");
        return;
      }

      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FaTags className="text-lg" />
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900">الماركات</h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            إدارة ماركات ومنتجات متجرك
            <span className="mx-2 text-gray-300">•</span>
            {items.length.toLocaleString("ar-EG")} ماركة
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
        >
          <FaPlus />
          إضافة ماركة جديدة
        </button>
      </div>

      {/* Brands */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-gray-100" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-6 w-1/2 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : items.length === 0 ? (
        <ListEmpty text="مفيش ماركات لسه، ابدأ بإضافة أول ماركة" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((brand) => {
            const logo = getImageUrl(brand.logo);

            return (
              <article
                key={brand._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
              >
                {/* Brand Logo */}
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-50 p-5">
                  {logo ? (
                    <img
                      src={logo}
                      alt={brand.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
                      <FaImage className="text-4xl text-indigo-200" />
                    </div>
                  )}

                  <span className="absolute end-3 top-3 rounded-full border border-gray-100 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-500 shadow-sm">
                    ماركة
                  </span>
                </div>

                {/* Brand Details */}
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <h3
                    title={brand.name}
                    className="truncate text-sm font-extrabold text-gray-800 transition-colors group-hover:text-indigo-600 sm:text-base"
                  >
                    {brand.name}
                  </h3>

                  {/* Categories */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
                        <FaLayerGroup />
                        الفئات المرتبطة
                      </span>

                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                        {brand.categories.length.toLocaleString("ar-EG")}
                      </span>
                    </div>

                    <div className="flex min-h-10 flex-wrap content-start gap-1.5">
                      {brand.categories.length > 0 ? (
                        brand.categories.slice(0, 3).map((category) => (
                          <span
                            key={category._id}
                            className="max-w-full truncate rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600 sm:text-xs"
                            title={category.name}
                          >
                            {category.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          لا توجد فئات مرتبطة
                        </span>
                      )}

                      {brand.categories.length > 3 && (
                        <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">
                          +{brand.categories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setFormFor(brand)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-600 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white sm:text-sm"
                    >
                      <FaEdit />
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setDeleting(brand);
                      }}
                      aria-label={`حذف ${brand.name}`}
                      className="flex items-center justify-center rounded-xl border border-red-100 bg-red-50 px-3.5 text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Brand Form */}
      {formFor && (
        <BrandFormModal
          brand={formFor === "new" ? null : formFor}
          categories={categories}
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
          title="حذف الماركة"
          message={`هل تريد حذف ماركة "${deleting.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
