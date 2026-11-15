"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  FaEdit,
  FaExclamationTriangle,
  FaSpinner,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { formatDate } from "@/lib/format";
import type { ApiResponse, Review } from "@/types";
import type { ReviewValues } from "@/lib/validations/reviews";
import Stars from "./Stars";
import ReviewForm from "./ReviewForm";

export default function ReviewsSection({ productId }: { productId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<ApiResponse<Review[]>>(
        `/reviews/${productId}`,
      );
      setReviews(data.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // بنعرف هو مسجّل ولا لأ من وجود تقييم "mine" أو من محاولة إرسال لاحقًا؛
  // الأبسط: نسأل الـ profile مرة واحدة
  useEffect(() => {
    let cancelled = false;
    api
      .get("/profile")
      .then(() => !cancelled && setLoggedIn(true))
      .catch(() => !cancelled && setLoggedIn(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const mine = reviews.find((r) => r.mine);
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  function handleAuthError(err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return true;
    }
    return false;
  }

  async function addReview(values: ReviewValues) {
    try {
      await api.post(`/reviews/${productId}`, values);
      await load();
    } catch (err) {
      if (handleAuthError(err)) return;
      throw new Error(getErrorMessage(err));
    }
  }

  async function updateReview(reviewId: string, values: ReviewValues) {
    try {
      await api.patch(`/reviews/item/${reviewId}`, values);
      setEditingId(null);
      await load();
    } catch (err) {
      if (handleAuthError(err)) return;
      throw new Error(getErrorMessage(err));
    }
  }

  async function deleteReview(reviewId: string) {
    setActionError("");
    setDeletingId(reviewId);
    try {
      await api.delete(`/reviews/item/${reviewId}`);
      setConfirmId(null);
      await load();
    } catch (err) {
      if (!handleAuthError(err)) setActionError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">التقييمات</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Stars value={average} />
            <span className="font-bold text-gray-800">
              {average.toLocaleString("ar-EG", { maximumFractionDigits: 1 })}
            </span>
            <span>({reviews.length.toLocaleString("ar-EG")} تقييم)</span>
          </div>
        )}
      </div>

      {/* إضافة تقييم */}
      <div className="mb-8 rounded-2xl bg-gray-50 p-5">
        {loggedIn === false ? (
          <p className="text-sm text-gray-600">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="font-semibold text-blue-600"
            >
              سجّل الدخول
            </Link>{" "}
            عشان تضيف تقييمك.
          </p>
        ) : loggedIn === null || loading ? (
          <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
        ) : mine ? (
          <p className="text-sm text-gray-600">
            شكرًا لتقييمك! تقدر تعدّله أو تحذفه من القائمة تحت.
          </p>
        ) : (
          <>
            <h3 className="mb-3 font-semibold text-gray-800">أضف تقييمك</h3>
            <ReviewForm submitLabel="إرسال التقييم" onSubmit={addReview} />
          </>
        )}
      </div>

      {actionError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {actionError}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-red-600">
          <FaExclamationTriangle /> {error}
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          مفيش تقييمات لسه، كن أول من يقيّم المنتج.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r._id}
              className={`rounded-2xl border p-4 ${
                r.mine ? "border-blue-200 bg-blue-50/40" : "border-gray-200"
              }`}
            >
              {editingId === r._id ? (
                <ReviewForm
                  initial={{ rating: r.rating, comment: r.comment }}
                  submitLabel="حفظ التعديل"
                  onSubmit={(v) => updateReview(r._id, v)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <FaUserCircle className="text-2xl text-gray-300" />
                    <span className="font-semibold text-gray-800">
                      {r.authorName}
                      {r.mine && (
                        <span className="ms-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                          تقييمك
                        </span>
                      )}
                    </span>
                    <Stars value={r.rating} />
                    <span className="ms-auto text-xs text-gray-400">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>

                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-gray-700">
                    {r.comment}
                  </p>

                  {r.mine && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {confirmId === r._id ? (
                        <>
                          <span className="text-sm text-gray-600">
                            حذف التقييم؟
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteReview(r._id)}
                            disabled={deletingId === r._id}
                            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          >
                            {deletingId === r._id && (
                              <FaSpinner className="animate-spin" />
                            )}
                            تأكيد
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                          >
                            إلغاء
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setActionError("");
                              setEditingId(r._id);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
                          >
                            <FaEdit /> تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActionError("");
                              setConfirmId(r._id);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                          >
                            <FaTrash /> حذف
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
