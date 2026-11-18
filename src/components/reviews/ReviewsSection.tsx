// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import axios from "axios";
// import {
//   FaEdit,
//   FaExclamationTriangle,
//   FaSpinner,
//   FaTrash,
//   FaUserCircle,
// } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { formatDate } from "@/lib/format";
// import type { ApiResponse, Review } from "@/types";
// import type { ReviewValues } from "@/lib/validations/reviews";
// import Stars from "./Stars";
// import ReviewForm from "./ReviewForm";

// export default function ReviewsSection({ productId }: { productId: string }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [confirmId, setConfirmId] = useState<string | null>(null);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [actionError, setActionError] = useState("");
//   const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

//   const load = useCallback(async () => {
//     try {
//       const { data } = await api.get<ApiResponse<Review[]>>(
//         `/reviews/${productId}`,
//       );
//       setReviews(data.data);
//       setError("");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }, [productId]);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     load();
//   }, [load]);

//   // بنعرف هو مسجّل ولا لأ من وجود تقييم "mine" أو من محاولة إرسال لاحقًا؛
//   // الأبسط: نسأل الـ profile مرة واحدة
//   useEffect(() => {
//     let cancelled = false;
//     api
//       .get("/profile")
//       .then(() => !cancelled && setLoggedIn(true))
//       .catch(() => !cancelled && setLoggedIn(false));
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const mine = reviews.find((r) => r.mine);
//   const average = reviews.length
//     ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//     : 0;

//   function handleAuthError(err: unknown) {
//     if (axios.isAxiosError(err) && err.response?.status === 401) {
//       router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
//       return true;
//     }
//     return false;
//   }

//   async function addReview(values: ReviewValues) {
//     try {
//       await api.post(`/reviews/${productId}`, values);
//       await load();
//     } catch (err) {
//       if (handleAuthError(err)) return;
//       throw new Error(getErrorMessage(err));
//     }
//   }

//   async function updateReview(reviewId: string, values: ReviewValues) {
//     try {
//       await api.patch(`/reviews/item/${reviewId}`, values);
//       setEditingId(null);
//       await load();
//     } catch (err) {
//       if (handleAuthError(err)) return;
//       throw new Error(getErrorMessage(err));
//     }
//   }

//   async function deleteReview(reviewId: string) {
//     setActionError("");
//     setDeletingId(reviewId);
//     try {
//       await api.delete(`/reviews/item/${reviewId}`);
//       setConfirmId(null);
//       await load();
//     } catch (err) {
//       if (!handleAuthError(err)) setActionError(getErrorMessage(err));
//     } finally {
//       setDeletingId(null);
//     }
//   }

//   return (
//     <section className="mt-12 border-t border-gray-200 pt-8">
//       <div className="mb-6 flex flex-wrap items-center gap-3">
//         <h2 className="text-xl font-bold text-gray-800">التقييمات</h2>
//         {reviews.length > 0 && (
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Stars value={average} />
//             <span className="font-bold text-gray-800">
//               {average.toLocaleString("ar-EG", { maximumFractionDigits: 1 })}
//             </span>
//             <span>({reviews.length.toLocaleString("ar-EG")} تقييم)</span>
//           </div>
//         )}
//       </div>

//       {/* إضافة تقييم */}
//       <div className="mb-8 rounded-2xl bg-gray-50 p-5">
//         {loggedIn === false ? (
//           <p className="text-sm text-gray-600">
//             <Link
//               href={`/login?redirect=${encodeURIComponent(pathname)}`}
//               className="font-semibold text-blue-600"
//             >
//               سجّل الدخول
//             </Link>{" "}
//             عشان تضيف تقييمك.
//           </p>
//         ) : loggedIn === null || loading ? (
//           <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
//         ) : mine ? (
//           <p className="text-sm text-gray-600">
//             شكرًا لتقييمك! تقدر تعدّله أو تحذفه من القائمة تحت.
//           </p>
//         ) : (
//           <>
//             <h3 className="mb-3 font-semibold text-gray-800">أضف تقييمك</h3>
//             <ReviewForm submitLabel="إرسال التقييم" onSubmit={addReview} />
//           </>
//         )}
//       </div>

//       {actionError && (
//         <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
//           {actionError}
//         </p>
//       )}

//       {loading ? (
//         <div className="space-y-3">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div
//               key={i}
//               className="h-24 animate-pulse rounded-2xl bg-gray-100"
//             />
//           ))}
//         </div>
//       ) : error ? (
//         <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-red-600">
//           <FaExclamationTriangle /> {error}
//         </div>
//       ) : reviews.length === 0 ? (
//         <p className="py-8 text-center text-gray-500">
//           مفيش تقييمات لسه، كن أول من يقيّم المنتج.
//         </p>
//       ) : (
//         <ul className="space-y-4">
//           {reviews.map((r) => (
//             <li
//               key={r._id}
//               className={`rounded-2xl border p-4 ${
//                 r.mine ? "border-blue-200 bg-blue-50/40" : "border-gray-200"
//               }`}
//             >
//               {editingId === r._id ? (
//                 <ReviewForm
//                   initial={{ rating: r.rating, comment: r.comment }}
//                   submitLabel="حفظ التعديل"
//                   onSubmit={(v) => updateReview(r._id, v)}
//                   onCancel={() => setEditingId(null)}
//                 />
//               ) : (
//                 <>
//                   <div className="flex flex-wrap items-center gap-3">
//                     <FaUserCircle className="text-2xl text-gray-300" />
//                     <span className="font-semibold text-gray-800">
//                       {r.authorName}
//                       {r.mine && (
//                         <span className="ms-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
//                           تقييمك
//                         </span>
//                       )}
//                     </span>
//                     <Stars value={r.rating} />
//                     <span className="ms-auto text-xs text-gray-400">
//                       {formatDate(r.createdAt)}
//                     </span>
//                   </div>

//                   <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-gray-700">
//                     {r.comment}
//                   </p>

//                   {r.mine && (
//                     <div className="mt-3 flex flex-wrap items-center gap-2">
//                       {confirmId === r._id ? (
//                         <>
//                           <span className="text-sm text-gray-600">
//                             حذف التقييم؟
//                           </span>
//                           <button
//                             type="button"
//                             onClick={() => deleteReview(r._id)}
//                             disabled={deletingId === r._id}
//                             className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
//                           >
//                             {deletingId === r._id && (
//                               <FaSpinner className="animate-spin" />
//                             )}
//                             تأكيد
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => setConfirmId(null)}
//                             className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
//                           >
//                             إلغاء
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setActionError("");
//                               setEditingId(r._id);
//                             }}
//                             className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
//                           >
//                             <FaEdit /> تعديل
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setActionError("");
//                               setConfirmId(r._id);
//                             }}
//                             className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
//                           >
//                             <FaTrash /> حذف
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// }

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
  FaStar,
  FaRegCommentDots,
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

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

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
      if (!handleAuthError(err)) {
        setActionError(getErrorMessage(err));
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="mt-12 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:mt-16 sm:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#f0efff] px-3 py-1.5 text-xs font-bold text-[#6366f1]">
            <FaRegCommentDots />
            آراء العملاء
          </span>

          <h2 className="text-2xl font-extrabold text-gray-900">
            التقييمات والمراجعات
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            اكتشف تجارب وآراء العملاء حول هذا المنتج
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0efff] text-xl text-[#6366f1]">
          <FaStar />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-36 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-red-600">
          <FaExclamationTriangle />
          {error}
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-6 rounded-2xl bg-[#f8f8fb] p-5 md:grid-cols-[220px_minmax(0,1fr)] md:p-7">
            <div className="flex flex-col items-center justify-center border-b border-gray-200 pb-5 text-center md:border-b-0 md:border-l md:pb-0 md:pl-6">
              <p className="text-5xl font-extrabold text-gray-900">
                {average.toLocaleString("ar-EG", {
                  maximumFractionDigits: 1,
                })}
              </p>

              <Stars value={average} className="mt-3 text-xl" />

              <p className="mt-2 text-xs font-semibold text-gray-400">
                بناءً على {reviews.length.toLocaleString("ar-EG")} تقييم
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3">
              {ratingCounts.map(({ rating, count }) => {
                const percentage = reviews.length
                  ? (count / reviews.length) * 100
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-3 text-xs">
                    <span className="flex w-10 shrink-0 items-center gap-1 font-bold text-gray-600">
                      {rating}
                      <FaStar className="text-yellow-400" />
                    </span>

                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-[#6366f1] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="w-8 text-left font-semibold text-gray-400">
                      {count.toLocaleString("ar-EG")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-100 p-5 sm:p-6">
            {loggedIn === false ? (
              <p className="text-sm text-gray-600">
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="font-bold text-[#6366f1] hover:underline"
                >
                  سجّل الدخول
                </Link>{" "}
                عشان تضيف تقييمك.
              </p>
            ) : loggedIn === null ? (
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
            ) : mine ? (
              <p className="text-sm font-semibold text-gray-600">
                شكرًا لتقييمك! تقدر تعدّله أو تحذفه من قائمتك بالأسفل.
              </p>
            ) : (
              <>
                <h3 className="mb-4 font-bold text-gray-900">
                  شاركنا رأيك في المنتج
                </h3>

                <ReviewForm submitLabel="إرسال التقييم" onSubmit={addReview} />
              </>
            )}
          </div>

          {actionError && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {actionError}
            </p>
          )}

          {reviews.length === 0 ? (
            <div className="rounded-2xl bg-[#f8f8fb] py-12 text-center">
              <FaRegCommentDots className="mx-auto mb-4 text-4xl text-gray-300" />

              <h3 className="font-bold text-gray-700">
                لا توجد تقييمات حتى الآن
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                كن أول من يشارك تجربته مع هذا المنتج.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="mb-5 font-bold text-gray-900">
                آراء العملاء ({reviews.length.toLocaleString("ar-EG")})
              </h3>

              <ul className="space-y-4">
                {reviews.map((r) => (
                  <li
                    key={r._id}
                    className={`rounded-2xl border p-5 transition ${
                      r.mine
                        ? "border-[#dcdafe] bg-[#fafaff]"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    {editingId === r._id ? (
                      <ReviewForm
                        initial={{
                          rating: r.rating,
                          comment: r.comment,
                        }}
                        submitLabel="حفظ التعديل"
                        onSubmit={(v) => updateReview(r._id, v)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0efff] text-xl text-[#6366f1]">
                            <FaUserCircle />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-gray-900">
                                {r.authorName}
                              </span>

                              {r.mine && (
                                <span className="rounded-full bg-[#eeedff] px-2.5 py-1 text-[10px] font-bold text-[#6366f1]">
                                  تقييمك
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                              {formatDate(r.createdAt)}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#fff9e8] px-3 py-2">
                            <Stars value={r.rating} />
                          </div>
                        </div>

                        <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-gray-600">
                          {r.comment}
                        </p>

                        {r.mine && (
                          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                            {confirmId === r._id ? (
                              <>
                                <span className="me-2 text-sm text-gray-600">
                                  هل تريد حذف التقييم؟
                                </span>

                                <button
                                  type="button"
                                  onClick={() => deleteReview(r._id)}
                                  disabled={deletingId === r._id}
                                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                                >
                                  {deletingId === r._id && (
                                    <FaSpinner className="animate-spin" />
                                  )}
                                  تأكيد الحذف
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setConfirmId(null)}
                                  className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200"
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
                                  className="flex items-center gap-2 rounded-lg bg-[#f0efff] px-4 py-2 text-xs font-bold text-[#6366f1] transition hover:bg-[#e7e5ff]"
                                >
                                  <FaEdit />
                                  تعديل
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionError("");
                                    setConfirmId(r._id);
                                  }}
                                  className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-100"
                                >
                                  <FaTrash />
                                  حذف
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
            </div>
          )}
        </>
      )}
    </section>
  );
}
