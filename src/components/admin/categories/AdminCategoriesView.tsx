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
// import type { Category } from "@/types";
// import { ListEmpty, ListError } from "@/components/ListStates";
// import ConfirmDialog from "../ConfirmDialog";
// import CategoryFormModal from "./CategoryFormModal";

// export default function AdminCategoriesView() {
//   const router = useRouter();
//   const { items, loading, error, retry, refresh } = useList<Category>(
//     "/categories",
//     "/admin/categories",
//   );

//   const [formFor, setFormFor] = useState<Category | "new" | null>(null);
//   const [deleting, setDeleting] = useState<Category | null>(null);
//   const [deleteBusy, setDeleteBusy] = useState(false);
//   const [deleteError, setDeleteError] = useState("");

//   async function confirmDelete() {
//     if (!deleting) return;
//     setDeleteBusy(true);
//     setDeleteError("");
//     try {
//       await api.delete(`/admin/categories/${deleting._id}`);
//       setDeleting(null);
//       refresh();
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push("/login?redirect=/admin/categories");
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
//           <h1 className="text-2xl font-bold text-gray-800">الفئات</h1>
//           <p className="text-sm text-gray-500">
//             {items.length.toLocaleString("ar-EG")} فئة
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setFormFor("new")}
//           className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//         >
//           <FaPlus /> إضافة فئة
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
//         <ListEmpty text="مفيش فئات لسه، ابدأ بإضافة أول فئة" />
//       ) : (
//         <ul className="space-y-3">
//           {items.map((c) => {
//             const logo = getImageUrl(c.logo);
//             return (
//               <li
//                 key={c._id}
//                 className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3"
//               >
//                 <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
//                   {logo ? (
//                     <img
//                       src={logo}
//                       alt={c.name}
//                       loading="lazy"
//                       className="h-full w-full object-contain"
//                     />
//                   ) : (
//                     <FaImage className="text-2xl text-gray-300" />
//                   )}
//                 </div>
//                 <span className="min-w-0 flex-1 truncate font-bold text-gray-800">
//                   {c.name}
//                 </span>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setFormFor(c)}
//                     aria-label={`تعديل ${c.name}`}
//                     className="rounded-lg p-2.5 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setDeleteError("");
//                       setDeleting(c);
//                     }}
//                     aria-label={`حذف ${c.name}`}
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
//         <CategoryFormModal
//           category={formFor === "new" ? null : formFor}
//           onClose={() => setFormFor(null)}
//           onSaved={() => {
//             setFormFor(null);
//             refresh();
//           }}
//         />
//       )}

//       {deleting && (
//         <ConfirmDialog
//           title="حذف الفئة"
//           message={`هل تريد حذف فئة "${deleting.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
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
import { FaEdit, FaImage, FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { useList } from "@/lib/useList";
import type { Category } from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";
import CategoryFormModal from "./CategoryFormModal";

export default function AdminCategoriesView() {
  const router = useRouter();

  const { items, loading, error, retry, refresh } = useList<Category>(
    "/categories",
    "/admin/categories",
  );

  const [formFor, setFormFor] = useState<Category | "new" | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function confirmDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    setDeleteError("");

    try {
      await api.delete(`/admin/categories/${deleting._id}`);
      setDeleting(null);
      refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/categories");
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
              <FaLayerGroup className="text-lg" />
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900">الفئات</h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            إدارة وتصنيف منتجات المتجر
            <span className="mx-2 text-gray-300">•</span>
            {items.length.toLocaleString("ar-EG")} فئة
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
        >
          <FaPlus />
          إضافة فئة جديدة
        </button>
      </div>

      {/* Categories */}
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
        <ListEmpty text="مفيش فئات لسه، ابدأ بإضافة أول فئة" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((category) => {
            const logo = getImageUrl(category.logo);

            return (
              <article
                key={category._id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40"
              >
                {/* Category Image */}
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-50 p-5">
                  {logo ? (
                    <img
                      src={logo}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
                      <FaImage className="text-4xl text-indigo-200" />
                    </div>
                  )}

                  <span className="absolute end-3 top-3 rounded-full border border-gray-100 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-gray-500 shadow-sm">
                    فئة
                  </span>
                </div>

                {/* Category Details */}
                <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                  <div className="flex flex-1 items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <FaLayerGroup className="text-sm" />
                    </div>

                    <h3
                      title={category.name}
                      className="min-w-0 truncate text-sm font-extrabold text-gray-800 transition-colors group-hover:text-indigo-600 sm:text-base"
                    >
                      {category.name}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-gray-500">
                      تصنيف للمنتجات
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setFormFor(category)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-600 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white sm:text-sm"
                    >
                      <FaEdit />
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setDeleting(category);
                      }}
                      aria-label={`حذف ${category.name}`}
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

      {/* Category Form */}
      {formFor && (
        <CategoryFormModal
          category={formFor === "new" ? null : formFor}
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
          title="حذف الفئة"
          message={`هل تريد حذف فئة "${deleting.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
