"use client";

import { useState } from "react";
import { FaEdit, FaPlus, FaTicketAlt, FaTrash } from "react-icons/fa";
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
  if (new Date(coupon.expiryDate).getTime() <= Date.now()) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
        منتهي
      </span>
    );
  }
  if (coupon.usedCount >= coupon.maxUsageCount) {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
        مستنفد
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
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
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الكوبونات</h1>
          <p className="text-sm text-gray-500">
            {items.length.toLocaleString("ar-EG")} كوبون
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FaPlus /> إضافة كوبون
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : items.length === 0 ? (
        <ListEmpty text="مفيش كوبونات لسه، ابدأ بإضافة أول كوبون" />
      ) : (
        <ul className="space-y-3">
          {items.map((c) => {
            const percent = Math.min(
              100,
              Math.round((c.usedCount / c.maxUsageCount) * 100),
            );
            return (
              <li
                key={c._id}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                  <FaTicketAlt />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      dir="ltr"
                      className="font-mono text-base font-bold text-gray-800"
                    >
                      {c.code}
                    </p>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                      خصم {c.discountPercentage.toLocaleString("ar-EG")}%
                    </span>
                    <Status coupon={c} />
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {c.usedCount.toLocaleString("ar-EG")} /{" "}
                      {c.maxUsageCount.toLocaleString("ar-EG")} استخدام
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500">
                    ينتهي: {formatDay(c.expiryDate)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormFor(c)}
                    aria-label={`تعديل ${c.code}`}
                    className="rounded-lg p-2.5 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError("");
                      setDeleting(c);
                    }}
                    aria-label={`إلغاء ${c.code}`}
                    className="rounded-lg p-2.5 text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
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
