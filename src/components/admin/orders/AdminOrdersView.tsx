// "use client";

// /* eslint-disable @next/next/no-img-element */

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaImage,
//   FaSpinner,
// } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { formatDate, formatPrice } from "@/lib/format";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { getImageUrl } from "@/lib/image";
// import type {
//   AdminOrder,
//   AdminOrdersResult,
//   ApiResponse,
//   OrderStatus,
// } from "@/types";
// import { ListEmpty, ListError } from "@/components/ListStates";
// import ConfirmDialog from "../ConfirmDialog";

// const PAGE_SIZE = 10;

// const statusStyles: Record<OrderStatus, { label: string; className: string }> =
//   {
//     PENDING: {
//       label: "قيد الانتظار",
//       className: "bg-yellow-50 text-yellow-700",
//     },
//     PAID: { label: "تم الدفع", className: "bg-green-50 text-green-700" },
//     CONFIRMED: { label: "تم التأكيد", className: "bg-blue-50 text-blue-700" },
//     SHIPPED: { label: "تم الشحن", className: "bg-indigo-50 text-indigo-700" },
//     DELIVERED: {
//       label: "تم التسليم",
//       className: "bg-emerald-50 text-emerald-700",
//     },
//     CANCELLED: { label: "ملغي", className: "bg-red-50 text-red-600" },
//   };

// const paymentLabels = { CARD: "بطاقة", CASH: "عند الاستلام" } as const;

// const FILTERS: { value: "" | OrderStatus; label: string }[] = [
//   { value: "", label: "الكل" },
//   { value: "PENDING", label: "قيد الانتظار" },
//   { value: "PAID", label: "تم الدفع" },
//   { value: "CONFIRMED", label: "تم التأكيد" },
//   { value: "SHIPPED", label: "تم الشحن" },
//   { value: "DELIVERED", label: "تم التسليم" },
//   { value: "CANCELLED", label: "ملغي" },
// ];

// function nextStep(
//   o: AdminOrder,
// ): { status: OrderStatus; label: string } | null {
//   if (o.status === "PENDING" && o.paymentMethod === "CASH") {
//     return { status: "CONFIRMED", label: "تأكيد الطلب" };
//   }
//   if (o.status === "PAID") return { status: "CONFIRMED", label: "تأكيد الطلب" };
//   if (o.status === "CONFIRMED") return { status: "SHIPPED", label: "تم الشحن" };
//   if (o.status === "SHIPPED")
//     return { status: "DELIVERED", label: "تم التسليم" };
//   return null;
// }

// const canCancel = (o: AdminOrder) =>
//   o.status === "PENDING" || o.status === "PAID" || o.status === "CONFIRMED";

// export default function AdminOrdersView() {
//   const router = useRouter();

//   const [filter, setFilter] = useState<"" | OrderStatus>("");
//   const [page, setPage] = useState(1);
//   const [attempt, setAttempt] = useState(0);
//   const [data, setData] = useState<AdminOrdersResult | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [busyId, setBusyId] = useState<string | null>(null);
//   const [actionError, setActionError] = useState("");
//   const [cancelling, setCancelling] = useState<AdminOrder | null>(null);
//   const [cancelBusy, setCancelBusy] = useState(false);
//   const [cancelError, setCancelError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     api
//       .get<ApiResponse<AdminOrdersResult>>("/admin/orders", {
//         params: { page, limit: PAGE_SIZE, status: filter || undefined },
//       })
//       .then(({ data: res }) => {
//         if (cancelled) return;
//         setData(res.data);
//         setError("");
//       })
//       .catch((err) => {
//         if (cancelled) return;
//         if (axios.isAxiosError(err) && err.response?.status === 401) {
//           router.push("/login?redirect=/admin/orders");
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
//   }, [page, filter, attempt, router]);

//   function refresh() {
//     setAttempt((a) => a + 1);
//   }

//   function retry() {
//     setError("");
//     setLoading(true);
//     setAttempt((a) => a + 1);
//   }

//   function changeFilter(next: "" | OrderStatus) {
//     if (next === filter) return;
//     setLoading(true);
//     setActionError("");
//     setFilter(next);
//     setPage(1);
//   }

//   function goTo(next: number) {
//     setLoading(true);
//     setPage(next);
//   }

//   async function updateStatus(order: AdminOrder, status: OrderStatus) {
//     setBusyId(order._id);
//     setActionError("");
//     try {
//       await api.patch(`/admin/orders/${order._id}/status`, { status });
//       refresh();
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push("/login?redirect=/admin/orders");
//         return;
//       }
//       setActionError(getErrorMessage(err));
//       refresh();
//     } finally {
//       setBusyId(null);
//     }
//   }

//   async function confirmCancel() {
//     if (!cancelling) return;
//     setCancelBusy(true);
//     setCancelError("");
//     try {
//       await api.patch(`/admin/orders/${cancelling._id}/status`, {
//         status: "CANCELLED",
//       });
//       setCancelling(null);
//       refresh();
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push("/login?redirect=/admin/orders");
//         return;
//       }
//       setCancelError(getErrorMessage(err));
//     } finally {
//       setCancelBusy(false);
//     }
//   }

//   const orders = data?.orders ?? [];
//   const pagination = data?.pagination;

//   const cancelMessage = cancelling
//     ? cancelling.paymentMethod === "CARD" && cancelling.status !== "PENDING"
//       ? "هيتم إلغاء الطلب واسترداد المبلغ للعميل على بطاقته، وإرجاع المنتجات للمخزون. لا يمكن التراجع."
//       : "هيتم إلغاء الطلب وإرجاع المنتجات للمخزون. لا يمكن التراجع."
//     : "";

//   return (
//     <>
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
//         <p className="text-sm text-gray-500">
//           {(pagination?.total ?? 0).toLocaleString("ar-EG")} طلب
//         </p>
//       </div>

//       <div className="mb-5 flex flex-wrap gap-2">
//         {FILTERS.map((f) => (
//           <button
//             key={f.value || "all"}
//             type="button"
//             onClick={() => changeFilter(f.value)}
//             className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
//               filter === f.value
//                 ? "bg-blue-600 text-white"
//                 : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
//             }`}
//           >
//             {f.label}
//           </button>
//         ))}
//       </div>

//       {actionError && (
//         <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
//           {actionError}
//         </p>
//       )}

//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-40 animate-pulse rounded-2xl bg-gray-100"
//             />
//           ))}
//         </div>
//       ) : error ? (
//         <ListError message={error} onRetry={retry} />
//       ) : orders.length === 0 ? (
//         <ListEmpty text="مفيش طلبات في القسم ده" />
//       ) : (
//         <ul className="space-y-4">
//           {orders.map((o) => {
//             const status = statusStyles[o.status] ?? {
//               label: o.status,
//               className: "bg-gray-100 text-gray-700",
//             };
//             const next = nextStep(o);
//             const busy = busyId === o._id;
//             const customer = o.user
//               ? `${o.user.firstName} ${o.user.lastName}`
//               : "عميل محذوف";

//             return (
//               <li
//                 key={o._id}
//                 className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
//               >
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div>
//                     <p className="font-bold text-gray-800">
//                       طلب #{o._id.slice(-6).toUpperCase()}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {formatDate(o.createdAt)}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
//                       {paymentLabels[o.paymentMethod] ?? o.paymentMethod}
//                     </span>
//                     <span
//                       className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
//                     >
//                       {status.label}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid gap-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 sm:grid-cols-2">
//                   <p>
//                     <span className="font-semibold text-gray-700">
//                       العميل:{" "}
//                     </span>
//                     {customer}
//                   </p>
//                   {o.user?.email && (
//                     <p dir="ltr" className="text-start">
//                       {o.user.email}
//                     </p>
//                   )}
//                   <p>
//                     <span className="font-semibold text-gray-700">
//                       الهاتف:{" "}
//                     </span>
//                     <span dir="ltr">{o.phone}</span>
//                   </p>
//                   <p className="sm:col-span-2">
//                     <span className="font-semibold text-gray-700">
//                       العنوان:{" "}
//                     </span>
//                     {o.shippingAddress}
//                   </p>
//                 </div>

//                 <ul className="space-y-2">
//                   {o.items.map((item, i) => {
//                     const image = getImageUrl(item.product?.image);
//                     return (
//                       <li
//                         key={`${i}:${item.variantId ?? ""}`}
//                         className="flex items-center gap-3"
//                       >
//                         <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
//                           {image ? (
//                             <img
//                               src={image}
//                               alt=""
//                               loading="lazy"
//                               className="h-full w-full object-cover"
//                             />
//                           ) : (
//                             <FaImage className="text-gray-300" />
//                           )}
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm text-gray-700">
//                             {item.product?.title ?? "منتج محذوف"}
//                           </p>
//                           {item.variantLabel && (
//                             <p className="truncate text-xs text-gray-500">
//                               {item.variantLabel}
//                             </p>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-500">
//                           {item.quantity.toLocaleString("ar-EG")} ×{" "}
//                           {formatPrice(item.priceSnapShot)}
//                         </p>
//                       </li>
//                     );
//                   })}
//                 </ul>

//                 <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
//                   <div className="text-sm">
//                     {o.appliedCoupon && (
//                       <p className="text-xs text-green-700">
//                         كوبون {o.appliedCoupon.code} (-
//                         {formatPrice(o.discountAmount)})
//                       </p>
//                     )}
//                     <p className="font-bold text-blue-600">
//                       الإجمالي: {formatPrice(o.finalTotal)}
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap items-center gap-2">
//                     {o.status === "PENDING" && o.paymentMethod === "CARD" && (
//                       <span className="text-xs text-gray-500">
//                         في انتظار دفع العميل
//                       </span>
//                     )}
//                     {next && (
//                       <button
//                         type="button"
//                         disabled={busy}
//                         onClick={() => updateStatus(o, next.status)}
//                         className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//                       >
//                         {busy && <FaSpinner className="animate-spin" />}
//                         {next.label}
//                       </button>
//                     )}
//                     {canCancel(o) && (
//                       <button
//                         type="button"
//                         disabled={busy}
//                         onClick={() => {
//                           setCancelError("");
//                           setCancelling(o);
//                         }}
//                         className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
//                       >
//                         إلغاء الطلب
//                       </button>
//                     )}
//                   </div>
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

//       {cancelling && (
//         <ConfirmDialog
//           title="إلغاء الطلب"
//           message={cancelMessage}
//           confirmLabel="إلغاء الطلب"
//           busy={cancelBusy}
//           error={cancelError}
//           onConfirm={confirmCancel}
//           onClose={() => setCancelling(null)}
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
  FaImage,
  FaSpinner,
  FaShoppingBag,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaCalendarAlt,
  FaTag,
  FaCheckCircle,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import type {
  AdminOrder,
  AdminOrdersResult,
  ApiResponse,
  OrderStatus,
} from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";

const PAGE_SIZE = 10;

const statusStyles: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "قيد الانتظار",
      className: "bg-amber-50 text-amber-700",
    },
    PAID: { label: "تم الدفع", className: "bg-emerald-50 text-emerald-700" },
    CONFIRMED: {
      label: "تم التأكيد",
      className: "bg-blue-50 text-blue-700",
    },
    SHIPPED: {
      label: "تم الشحن",
      className: "bg-indigo-50 text-indigo-700",
    },
    DELIVERED: {
      label: "تم التسليم",
      className: "bg-green-50 text-green-700",
    },
    CANCELLED: { label: "ملغي", className: "bg-red-50 text-red-600" },
  };

const paymentLabels = { CARD: "بطاقة", CASH: "عند الاستلام" } as const;

const FILTERS: { value: "" | OrderStatus; label: string }[] = [
  { value: "", label: "الكل" },
  { value: "PENDING", label: "قيد الانتظار" },
  { value: "PAID", label: "تم الدفع" },
  { value: "CONFIRMED", label: "تم التأكيد" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التسليم" },
  { value: "CANCELLED", label: "ملغي" },
];

function nextStep(
  o: AdminOrder,
): { status: OrderStatus; label: string } | null {
  if (o.status === "PENDING" && o.paymentMethod === "CASH") {
    return { status: "CONFIRMED", label: "تأكيد الطلب" };
  }
  if (o.status === "PAID") return { status: "CONFIRMED", label: "تأكيد الطلب" };
  if (o.status === "CONFIRMED") return { status: "SHIPPED", label: "تم الشحن" };
  if (o.status === "SHIPPED")
    return { status: "DELIVERED", label: "تم التسليم" };
  return null;
}

const canCancel = (o: AdminOrder) =>
  o.status === "PENDING" || o.status === "PAID" || o.status === "CONFIRMED";

export default function AdminOrdersView() {
  const router = useRouter();

  const [filter, setFilter] = useState<"" | OrderStatus>("");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<AdminOrdersResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [cancelling, setCancelling] = useState<AdminOrder | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<AdminOrdersResult>>("/admin/orders", {
        params: { page, limit: PAGE_SIZE, status: filter || undefined },
      })
      .then(({ data: res }) => {
        if (cancelled) return;
        setData(res.data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/orders");
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
  }, [page, filter, attempt, router]);

  function refresh() {
    setAttempt((a) => a + 1);
  }

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  function changeFilter(next: "" | OrderStatus) {
    if (next === filter) return;
    setLoading(true);
    setActionError("");
    setFilter(next);
    setPage(1);
  }

  function goTo(next: number) {
    setLoading(true);
    setPage(next);
  }

  async function updateStatus(order: AdminOrder, status: OrderStatus) {
    setBusyId(order._id);
    setActionError("");

    try {
      await api.patch(`/admin/orders/${order._id}/status`, { status });
      refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/orders");
        return;
      }

      setActionError(getErrorMessage(err));
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function confirmCancel() {
    if (!cancelling) return;

    setCancelBusy(true);
    setCancelError("");

    try {
      await api.patch(`/admin/orders/${cancelling._id}/status`, {
        status: "CANCELLED",
      });
      setCancelling(null);
      refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/orders");
        return;
      }

      setCancelError(getErrorMessage(err));
    } finally {
      setCancelBusy(false);
    }
  }

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  const cancelMessage = cancelling
    ? cancelling.paymentMethod === "CARD" && cancelling.status !== "PENDING"
      ? "هيتم إلغاء الطلب واسترداد المبلغ للعميل على بطاقته، وإرجاع المنتجات للمخزون. لا يمكن التراجع."
      : "هيتم إلغاء الطلب وإرجاع المنتجات للمخزون. لا يمكن التراجع."
    : "";

  return (
    <>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
            <FaShoppingBag />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">الطلبات</h1>
            <p className="mt-1 text-sm text-gray-500">
              متابعة الطلبات وإدارة حالتها
              {pagination && (
                <span className="mr-1 font-semibold text-gray-700">
                  · {pagination.total.toLocaleString("ar-EG")} طلب
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              onClick={() => changeFilter(f.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filter === f.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {actionError && (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : orders.length === 0 ? (
        <ListEmpty text="مفيش طلبات في القسم ده" />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const status = statusStyles[o.status] ?? {
              label: o.status,
              className: "bg-gray-100 text-gray-700",
            };

            const next = nextStep(o);
            const busy = busyId === o._id;
            const customer = o.user
              ? `${o.user.firstName} ${o.user.lastName}`
              : "عميل محذوف";

            return (
              <article
                key={o._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-indigo-100 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:px-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-gray-900">
                        طلب #{o._id.slice(-6).toUpperCase()}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <FaCalendarAlt className="text-gray-400" />
                      {formatDate(o.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
                      <FaCreditCard className="text-gray-400" />
                      {paymentLabels[o.paymentMethod] ?? o.paymentMethod}
                    </span>

                    <span className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700">
                      {formatPrice(o.finalTotal)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1fr_1.2fr]">
                  <div className="space-y-3">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                        <FaUser className="text-indigo-500" />
                        بيانات العميل
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-semibold text-gray-800">
                          {customer}
                        </p>

                        {o.user?.email && (
                          <p dir="ltr" className="text-start text-xs">
                            {o.user.email}
                          </p>
                        )}

                        <p className="flex items-center gap-2">
                          <FaPhone className="shrink-0 text-gray-400" />
                          <span dir="ltr">{o.phone}</span>
                        </p>

                        <p className="flex items-start gap-2 leading-6">
                          <FaMapMarkerAlt className="mt-1 shrink-0 text-gray-400" />
                          <span>{o.shippingAddress}</span>
                        </p>
                      </div>
                    </div>

                    {o.appliedCoupon && (
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 p-3 text-sm">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <FaTag />
                          <span>كوبون {o.appliedCoupon.code}</span>
                        </div>
                        <span className="font-semibold text-emerald-700">
                          -{formatPrice(o.discountAmount)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <FaShoppingBag className="text-indigo-500" />
                        المنتجات
                      </h3>

                      <span className="text-xs text-gray-500">
                        {o.items.length.toLocaleString("ar-EG")} منتج
                      </span>
                    </div>

                    <div className="space-y-3">
                      {o.items.map((item, i) => {
                        const image = getImageUrl(item.product?.image);

                        return (
                          <div
                            key={`${i}:${item.variantId ?? ""}`}
                            className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                          >
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                              {image ? (
                                <img
                                  src={image}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FaImage className="text-xl text-gray-300" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {item.product?.title ?? "منتج محذوف"}
                              </p>

                              {item.variantLabel && (
                                <p className="mt-1 truncate text-xs text-gray-500">
                                  {item.variantLabel}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-gray-500">
                                الكمية: {item.quantity.toLocaleString("ar-EG")}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-semibold text-gray-700">
                              {formatPrice(item.priceSnapShot)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                  <div>
                    <p className="text-xs text-gray-500">إجمالي الطلب</p>
                    <p className="mt-1 text-xl font-extrabold text-indigo-600">
                      {formatPrice(o.finalTotal)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {o.status === "PENDING" && o.paymentMethod === "CARD" && (
                      <span className="text-xs text-amber-600">
                        في انتظار دفع العميل
                      </span>
                    )}

                    {next && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(o, next.status)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                      >
                        {busy ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaCheckCircle />
                        )}
                        {next.label}
                      </button>
                    )}

                    {canCancel(o) && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setCancelError("");
                          setCancelling(o);
                        }}
                        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        إلغاء الطلب
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && !loading && !error && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <FaChevronRight className="text-xs" />
            السابق
          </button>

          <span className="text-sm font-semibold text-gray-600">
            {pagination.page.toLocaleString("ar-EG")} من{" "}
            {pagination.totalPages.toLocaleString("ar-EG")}
          </span>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={!pagination.hasNextPage}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            التالي
            <FaChevronLeft className="text-xs" />
          </button>
        </div>
      )}

      {cancelling && (
        <ConfirmDialog
          title="إلغاء الطلب"
          message={cancelMessage}
          confirmLabel="إلغاء الطلب"
          busy={cancelBusy}
          error={cancelError}
          onConfirm={confirmCancel}
          onClose={() => setCancelling(null)}
        />
      )}
    </>
  );
}
