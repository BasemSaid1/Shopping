// "use client";

// import { useState } from "react";
// import { useFormik } from "formik";
// import { FaRegStar, FaSpinner, FaStar } from "react-icons/fa";
// import { zodValidate } from "@/lib/zodValidate";
// import { reviewSchema, type ReviewValues } from "@/lib/validations/reviews";

// interface Props {
//   initial?: ReviewValues;
//   submitLabel: string;
//   onSubmit: (values: ReviewValues) => Promise<void>;
//   onCancel?: () => void;
// }

// export default function ReviewForm({
//   initial,
//   submitLabel,
//   onSubmit,
//   onCancel,
// }: Props) {
//   const [hover, setHover] = useState(0);
//   const [serverError, setServerError] = useState("");

//   const formik = useFormik<ReviewValues>({
//     initialValues: initial ?? { rating: 0, comment: "" },
//     validate: zodValidate(reviewSchema),
//     onSubmit: async (values, helpers) => {
//       setServerError("");
//       try {
//         await onSubmit({ ...values, comment: values.comment.trim() });
//         if (!initial) helpers.resetForm();
//       } catch (err) {
//         setServerError(
//           err instanceof Error ? err.message : "حدث خطأ غير متوقع",
//         );
//       }
//     },
//   });

//   const shown = hover || formik.values.rating;

//   return (
//     <form onSubmit={formik.handleSubmit} noValidate className="space-y-3">
//       <div>
//         <div
//           className="flex gap-1 text-2xl text-yellow-400"
//           onMouseLeave={() => setHover(0)}
//         >
//           {[1, 2, 3, 4, 5].map((n) => (
//             <button
//               key={n}
//               type="button"
//               aria-label={`${n} نجوم`}
//               onMouseEnter={() => setHover(n)}
//               onClick={() => formik.setFieldValue("rating", n)}
//             >
//               {n <= shown ? <FaStar /> : <FaRegStar />}
//             </button>
//           ))}
//         </div>
//         {formik.touched.comment && formik.errors.rating && (
//           <p className="mt-1 text-xs text-red-600">{formik.errors.rating}</p>
//         )}
//       </div>

//       <div>
//         <textarea
//           name="comment"
//           rows={3}
//           value={formik.values.comment}
//           onChange={formik.handleChange}
//           onBlur={formik.handleBlur}
//           placeholder="اكتب رأيك في المنتج..."
//           className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//         />
//         {formik.touched.comment && formik.errors.comment && (
//           <p className="mt-1 text-xs text-red-600">{formik.errors.comment}</p>
//         )}
//       </div>

//       {serverError && <p className="text-sm text-red-600">{serverError}</p>}

//       <div className="flex gap-2">
//         <button
//           type="submit"
//           disabled={formik.isSubmitting}
//           className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
//         >
//           {formik.isSubmitting && <FaSpinner className="animate-spin" />}
//           {submitLabel}
//         </button>
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
//           >
//             إلغاء
//           </button>
//         )}
//       </div>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { FaRegStar, FaSpinner, FaStar } from "react-icons/fa";
import { zodValidate } from "@/lib/zodValidate";
import { reviewSchema, type ReviewValues } from "@/lib/validations/reviews";

interface Props {
  initial?: ReviewValues;
  submitLabel: string;
  onSubmit: (values: ReviewValues) => Promise<void>;
  onCancel?: () => void;
}

export default function ReviewForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: Props) {
  const [hover, setHover] = useState(0);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<ReviewValues>({
    initialValues: initial ?? { rating: 0, comment: "" },
    validate: zodValidate(reviewSchema),
    onSubmit: async (values, helpers) => {
      setServerError("");

      try {
        await onSubmit({
          ...values,
          comment: values.comment.trim(),
        });

        if (!initial) helpers.resetForm();
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "حدث خطأ غير متوقع",
        );
      }
    },
  });

  const shown = hover || formik.values.rating;

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700">
          تقييمك للمنتج
        </p>

        <div
          className="flex gap-2 text-3xl text-yellow-400"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} نجوم`}
              onMouseEnter={() => setHover(n)}
              onClick={() => formik.setFieldValue("rating", n)}
              className="transition hover:scale-110"
            >
              {n <= shown ? <FaStar /> : <FaRegStar />}
            </button>
          ))}
        </div>

        {formik.touched.rating && formik.errors.rating && (
          <p className="mt-2 text-xs text-red-600">{formik.errors.rating}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          اكتب تجربتك
        </label>

        <textarea
          name="comment"
          rows={4}
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="إيه رأيك في المنتج؟ شارك تجربتك معانا..."
          className="w-full resize-y rounded-xl border border-gray-200 bg-[#fafafa] p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6366f1] focus:bg-white focus:ring-4 focus:ring-[#6366f1]/10"
        />

        {formik.touched.comment && formik.errors.comment && (
          <p className="mt-2 text-xs text-red-600">{formik.errors.comment}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#5558e8] disabled:opacity-60"
        >
          {formik.isSubmitting && <FaSpinner className="animate-spin" />}
          {submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-200"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}
