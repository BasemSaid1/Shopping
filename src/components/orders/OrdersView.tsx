"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaBoxOpen,
  FaSpinner,
  FaSyncAlt,
  FaExclamationTriangle,
  FaImage,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { formatDate, formatPrice } from "@/lib/format";
import type { ApiResponse, Order, OrderStatus } from "@/types";

type Action = "pay" | "cancel" | "refund";

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

const confirmMessages = {
  cancel: "هل تريد إلغاء هذا الطلب؟",
  refund: "سيتم إلغاء الطلب واسترداد المبلغ لبطاقتك. هل أنت متأكد؟",
} as const;

interface OrderCardProps {
  order: Order;
  busy: Action | null;
  confirming: "cancel" | "refund" | null;
  onAction: (order: Order, action: Action) => void;
  onAsk: (orderId: string, action: "cancel" | "refund") => void;
  onDismiss: () => void;
}

function OrderCard({
  order,
  busy,
  confirming,
  onAction,
  onAsk,
  onDismiss,
}: OrderCardProps) {
  const status = statusStyles[order.status] ?? {
    label: order.status,
    className: "bg-gray-100 text-gray-700",
  };

  const canPay = order.status === "PENDING" && order.paymentMethod === "CARD";
  const canCancel = order.status === "PENDING";
  const canRefund = order.status === "PAID" && order.paymentMethod === "CARD";

  return (
    <li className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-gray-800">
            طلب #{order._id.slice(-6).toUpperCase()}
          </p>
          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <ul className="space-y-3 border-t border-gray-100 pt-4">
        {order.items.map((item, index) => {
          const product = item.product;
          const image = product ? getImageUrl(product.image) : null;

          return (
            <li key={product?._id ?? index} className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-300">
                {image ? (
                  <img
                    src={image}
                    alt={product?.title ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaImage />
                )}
              </div>

              <div className="min-w-0 flex-1">
                {product ? (
                  <Link
                    href={`/products/${product._id}`}
                    className="line-clamp-1 text-sm font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {product.title}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-gray-500">
                    منتج غير متاح
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {item.quantity.toLocaleString("ar-EG")} ×{" "}
                  {formatPrice(item.priceSnapShot)}
                </p>
              </div>

              <span className="text-sm font-semibold text-gray-700">
                {formatPrice(item.quantity * item.priceSnapShot)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="grid gap-4 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
        <div className="space-y-1 text-gray-600">
          <p>
            <span className="font-semibold text-gray-800">الدفع: </span>
            {paymentLabels[order.paymentMethod] ?? order.paymentMethod}
          </p>
          <p>
            <span className="font-semibold text-gray-800">العنوان: </span>
            {order.shippingAddress}
          </p>
          <p>
            <span className="font-semibold text-gray-800">الموبايل: </span>
            <span dir="ltr">{order.phone}</span>
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>المجموع</span>
            <span>{formatPrice(order.subTotal)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                خصم{order.appliedCoupon ? ` (${order.appliedCoupon.code})` : ""}
              </span>
              <span>- {formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
            <span>الإجمالي</span>
            <span className="text-blue-600">
              {formatPrice(order.finalTotal)}
            </span>
          </div>
        </div>
      </div>

      {(canPay || canCancel || canRefund) && (
        <div className="border-t border-gray-100 pt-4">
          {confirming ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold text-gray-700">
                {confirmMessages[confirming]}
              </p>
              <button
                type="button"
                onClick={() => onAction(order, confirming)}
                disabled={busy !== null}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {busy === confirming && <FaSpinner className="animate-spin" />}
                نعم، تأكيد
              </button>
              <button
                type="button"
                onClick={onDismiss}
                disabled={busy !== null}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                تراجع
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {canPay && (
                <button
                  type="button"
                  onClick={() => onAction(order, "pay")}
                  disabled={busy !== null}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {busy === "pay" && <FaSpinner className="animate-spin" />}
                  إكمال الدفع
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  onClick={() => onAsk(order._id, "cancel")}
                  disabled={busy !== null}
                  className="rounded-lg border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  إلغاء الطلب
                </button>
              )}
              {canRefund && (
                <button
                  type="button"
                  onClick={() => onAsk(order._id, "refund")}
                  disabled={busy !== null}
                  className="rounded-lg border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  إلغاء واسترداد المبلغ
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function OrdersView() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [busy, setBusy] = useState<{ id: string; action: Action } | null>(null);
  const [confirm, setConfirm] = useState<{
    id: string;
    action: "cancel" | "refund";
  } | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<Order[]>>("/orders")
      .then(({ data }) => {
        if (!cancelled) {
          setOrders(data.data);
          setLoadError("");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/orders");
          return;
        }
        setLoadError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router, attempt]);

  function reload() {
    setRefreshing(true);
    setAttempt((a) => a + 1);
  }

  async function runAction(order: Order, action: Action) {
    setActionError("");
    setBusy({ id: order._id, action });

    try {
      if (action === "pay") {
        const { data } = await api.post<ApiResponse<{ url: string | null }>>(
          `/orders/${order._id}/session`,
        );

        if (!data.data.url) {
          setActionError("تعذر بدء عملية الدفع، حاول مرة أخرى");
          return;
        }

        window.location.href = data.data.url;
        return;
      }

      if (action === "cancel") {
        await api.patch(`/orders/${order._id}/cancel`);
      } else {
        await api.post(`/orders/${order._id}/refund`);
      }

      setConfirm(null);
      reload();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/orders");
        return;
      }
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (loadError && !orders) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-semibold">{loadError}</p>
        <button
          type="button"
          onClick={reload}
          className="text-sm font-semibold underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 py-20 text-center">
        <FaBoxOpen className="text-6xl text-gray-300" />
        <p className="text-lg font-semibold text-gray-700">
          ما عندكش طلبات لسه
        </p>
        <Link
          href="/products"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {orders.length.toLocaleString("ar-EG")} طلب
        </p>
        <button
          type="button"
          onClick={reload}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 disabled:opacity-60"
        >
          <FaSyncAlt className={refreshing ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      {actionError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </p>
      )}

      <ul className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            busy={busy?.id === order._id ? busy.action : null}
            confirming={confirm?.id === order._id ? confirm.action : null}
            onAction={runAction}
            onAsk={(id, action) => {
              setActionError("");
              setConfirm({ id, action });
            }}
            onDismiss={() => setConfirm(null)}
          />
        ))}
      </ul>
    </div>
  );
}
