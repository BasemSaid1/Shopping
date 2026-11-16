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
      className: "bg-yellow-50 text-yellow-700",
    },
    PAID: { label: "تم الدفع", className: "bg-green-50 text-green-700" },
    CONFIRMED: { label: "تم التأكيد", className: "bg-blue-50 text-blue-700" },
    SHIPPED: { label: "تم الشحن", className: "bg-indigo-50 text-indigo-700" },
    DELIVERED: {
      label: "تم التسليم",
      className: "bg-emerald-50 text-emerald-700",
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
        <p className="text-sm text-gray-500">
          {(pagination?.total ?? 0).toLocaleString("ar-EG")} طلب
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            onClick={() => changeFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f.value
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {actionError}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : orders.length === 0 ? (
        <ListEmpty text="مفيش طلبات في القسم ده" />
      ) : (
        <ul className="space-y-4">
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
              <li
                key={o._id}
                className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-800">
                      طلب #{o._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(o.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {paymentLabels[o.paymentMethod] ?? o.paymentMethod}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="grid gap-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-600 sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-gray-700">
                      العميل:{" "}
                    </span>
                    {customer}
                  </p>
                  {o.user?.email && (
                    <p dir="ltr" className="text-start">
                      {o.user.email}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold text-gray-700">
                      الهاتف:{" "}
                    </span>
                    <span dir="ltr">{o.phone}</span>
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-semibold text-gray-700">
                      العنوان:{" "}
                    </span>
                    {o.shippingAddress}
                  </p>
                </div>

                <ul className="space-y-2">
                  {o.items.map((item, i) => {
                    const image = getImageUrl(item.product?.image);
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                          {image ? (
                            <img
                              src={image}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaImage className="text-gray-300" />
                          )}
                        </div>
                        <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                          {item.product?.title ?? "منتج محذوف"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity.toLocaleString("ar-EG")} ×{" "}
                          {formatPrice(item.priceSnapShot)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <div className="text-sm">
                    {o.appliedCoupon && (
                      <p className="text-xs text-green-700">
                        كوبون {o.appliedCoupon.code} (-
                        {formatPrice(o.discountAmount)})
                      </p>
                    )}
                    <p className="font-bold text-blue-600">
                      الإجمالي: {formatPrice(o.finalTotal)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {o.status === "PENDING" && o.paymentMethod === "CARD" && (
                      <span className="text-xs text-gray-500">
                        في انتظار دفع العميل
                      </span>
                    )}
                    {next && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(o, next.status)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {busy && <FaSpinner className="animate-spin" />}
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
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60"
                      >
                        إلغاء الطلب
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && !loading && !error && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            <FaChevronRight className="text-xs" /> السابق
          </button>
          <span className="text-sm text-gray-600">
            {pagination.page.toLocaleString("ar-EG")} من{" "}
            {pagination.totalPages.toLocaleString("ar-EG")}
          </span>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            التالي <FaChevronLeft className="text-xs" />
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
