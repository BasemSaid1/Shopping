// "use client";

// import { useState } from "react";
// import { FaEdit, FaPlus, FaTicketAlt, FaTrash } from "react-icons/fa";
// import { useList } from "@/lib/useList";
// import type { Coupon } from "@/types";
// import { ListEmpty, ListError } from "@/components/ListStates";
// import CouponFormModal from "./CouponFormModal";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import ConfirmDialog from "../ConfirmDialog";

// function formatDay(iso: string) {
//   return new Date(iso).toLocaleDateString("ar-EG", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// function Status({ coupon }: { coupon: Coupon }) {
//   if (coupon.usedCount >= coupon.maxUsageCount) {
//     return (
//       <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
//         مستنفد
//       </span>
//     );
//   }
//   return (
//     <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
//       فعّال
//     </span>
//   );
// }

// export default function AdminCouponsView() {
//   const { items, loading, error, retry, refresh } = useList<Coupon>(
//     "/admin/coupons",
//     "/admin/coupons",
//   );
//   const [formFor, setFormFor] = useState<Coupon | "new" | null>(null);

//   const router = useRouter();
//   const [deleting, setDeleting] = useState<Coupon | null>(null);
//   const [deleteBusy, setDeleteBusy] = useState(false);
//   const [deleteError, setDeleteError] = useState("");

//   async function confirmDelete() {
//     if (!deleting) return;
//     setDeleteBusy(true);
//     setDeleteError("");
//     try {
//       await api.delete(`/admin/coupons/${deleting._id}`);
//       setDeleting(null);
//       refresh();
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push("/login?redirect=/admin/coupons");
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
//           <h1 className="text-2xl font-bold text-gray-800">الكوبونات</h1>
//           <p className="text-sm text-gray-500">
//             {items.length.toLocaleString("ar-EG")} كوبون
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={() => setFormFor("new")}
//           className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
//         >
//           <FaPlus /> إضافة كوبون
//         </button>
//       </div>

//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-20 animate-pulse rounded-2xl bg-gray-100"
//             />
//           ))}
//         </div>
//       ) : error ? (
//         <ListError message={error} onRetry={retry} />
//       ) : items.length === 0 ? (
//         <ListEmpty text="مفيش كوبونات لسه، ابدأ بإضافة أول كوبون" />
//       ) : (
//         <ul className="space-y-3">
//           {items.map((c) => {
//             const percent = Math.min(
//               100,
//               Math.round((c.usedCount / c.maxUsageCount) * 100),
//             );
//             return (
//               <li
//                 key={c._id}
//                 className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
//               >
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
//                   <FaTicketAlt />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <p
//                       dir="ltr"
//                       className="font-mono text-base font-bold text-gray-800"
//                     >
//                       {c.code}
//                     </p>
//                     <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
//                       خصم {c.discountPercentage.toLocaleString("ar-EG")}%
//                     </span>
//                     <Status coupon={c} />
//                   </div>

//                   <div className="mt-2 flex items-center gap-3">
//                     <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
//                       <div
//                         className="h-full rounded-full bg-blue-500"
//                         style={{ width: `${percent}%` }}
//                       />
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {c.usedCount.toLocaleString("ar-EG")} /{" "}
//                       {c.maxUsageCount.toLocaleString("ar-EG")} استخدام
//                     </span>
//                   </div>

//                   <p className="mt-1 text-xs text-gray-500">
//                     ينتهي: {formatDay(c.expiryDate)}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setFormFor(c)}
//                     aria-label={`تعديل ${c.code}`}
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
//                     aria-label={`إلغاء ${c.code}`}
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
//         <CouponFormModal
//           coupon={formFor === "new" ? null : formFor}
//           onClose={() => setFormFor(null)}
//           onSaved={() => {
//             setFormFor(null);
//             refresh();
//           }}
//         />
//       )}

//       {deleting && (
//         <ConfirmDialog
//           title="إلغاء الكوبون"
//           message={`هل تريد إلغاء الكوبون "${deleting.code}"؟ مش هيقدر حد يستخدمه بعد كده. الطلبات اللي اتعملت بيه قبل كده مش هتتأثر.`}
//           confirmLabel="إلغاء الكوبون"
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

import { useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaTicketAlt,
  FaTrash,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import { useList } from "@/lib/useList";
import type { Coupon } from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import CouponFormModal from "./CouponFormModal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import ConfirmDialog from "../ConfirmDialog";

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Status({ coupon }: { coupon: Coupon }) {
  if (coupon.usedCount >= coupon.maxUsageCount) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        مستنفد
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      فعّال
    </span>
  );
}

export default function AdminCouponsView() {
  const { items, loading, error, retry, refresh } = useList<Coupon>(
    "/admin/coupons",
    "/admin/coupons",
  );

  const [formFor, setFormFor] = useState<Coupon | "new" | null>(null);
  const router = useRouter();

  const [deleting, setDeleting] = useState<Coupon | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function confirmDelete() {
    if (!deleting) return;

    setDeleteBusy(true);
    setDeleteError("");

    try {
      await api.delete(`/admin/coupons/${deleting._id}`);
      setDeleting(null);
      refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/coupons");
        return;
      }

      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
              <FaTicketAlt />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">الكوبونات</h1>
              <p className="mt-1 text-sm text-gray-500">
                إدارة أكواد الخصم والعروض
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <FaPlus />
          إضافة كوبون
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الكوبونات</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {items.length.toLocaleString("ar-EG")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
              <FaTicketAlt />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الكوبونات الفعّالة</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {items
                  .filter((c) => c.usedCount < c.maxUsageCount)
                  .length.toLocaleString("ar-EG")}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
              <FaCheckCircle />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : items.length === 0 ? (
        <ListEmpty text="مفيش كوبونات لسه، ابدأ بإضافة أول كوبون" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((c) => {
            const percent = Math.min(
              100,
              Math.round((c.usedCount / c.maxUsageCount) * 100),
            );

            return (
              <div
                key={c._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg"
              >
                <div className="border-b border-dashed border-gray-200 bg-gradient-to-l from-indigo-50/80 to-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-600">
                      <FaTicketAlt />
                    </div>

                    <Status coupon={c} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="mb-1 text-xs text-gray-500">كود الخصم</p>
                      <p
                        dir="ltr"
                        className="text-xl font-bold tracking-wider text-gray-900"
                      >
                        {c.code}
                      </p>
                    </div>

                    <div className="rounded-xl bg-indigo-600 px-4 py-2 text-center text-white">
                      <p className="text-2xl font-extrabold leading-none">
                        {c.discountPercentage.toLocaleString("ar-EG")}%
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-indigo-100">
                        نسبة الخصم
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <FaChartLine className="text-indigo-500" />
                        مرات الاستخدام
                      </div>

                      <span className="text-xs font-semibold text-gray-600">
                        {c.usedCount.toLocaleString("ar-EG")} /{" "}
                        {c.maxUsageCount.toLocaleString("ar-EG")}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-600">
                    <FaCalendarAlt className="shrink-0 text-gray-400" />
                    <span>ينتهي في:</span>
                    <span className="font-semibold text-gray-800">
                      {formatDay(c.expiryDate)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setFormFor(c)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
                    >
                      <FaEdit />
                      تعديل
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError("");
                        setDeleting(c);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <FaTrash />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formFor && (
        <CouponFormModal
          coupon={formFor === "new" ? null : formFor}
          onClose={() => setFormFor(null)}
          onSaved={() => {
            setFormFor(null);
            refresh();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="إلغاء الكوبون"
          message={`هل تريد إلغاء الكوبون "${deleting.code}"؟ مش هيقدر حد يستخدمه بعد كده. الطلبات اللي اتعملت بيه قبل كده مش هتتأثر.`}
          confirmLabel="إلغاء الكوبون"
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
