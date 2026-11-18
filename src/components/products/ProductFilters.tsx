// "use client";

// import { useRouter } from "next/navigation";
// import { useFormik } from "formik";
// import { zodValidate } from "@/lib/zodValidate";
// import {
//   productFiltersSchema,
//   type ProductFiltersValues,
// } from "@/lib/validations/products";

// interface ProductFiltersProps {
//   initial: ProductFiltersValues;
//   preserved: Record<string, string>;
// }

// const fieldClass =
//   "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";

// export default function ProductFilters({
//   initial,
//   preserved,
// }: ProductFiltersProps) {
//   const router = useRouter();

//   function go(params: URLSearchParams) {
//     const qs = params.toString();
//     router.push(qs ? `/products?${qs}` : "/products");
//   }

//   const formik = useFormik<ProductFiltersValues>({
//     initialValues: initial,
//     enableReinitialize: true,
//     validate: zodValidate(productFiltersSchema),
//     onSubmit: (values) => {
//       const params = new URLSearchParams(preserved);
//       if (values.sort !== "newest") params.set("sort", values.sort);
//       if (values.minPrice.trim())
//         params.set("minPrice", values.minPrice.trim());
//       if (values.maxPrice.trim())
//         params.set("maxPrice", values.maxPrice.trim());
//       if (values.inStock) params.set("inStock", "true");
//       go(params);
//     },
//   });

//   const priceError = (name: "minPrice" | "maxPrice") =>
//     formik.touched[name] && formik.errors[name];

//   return (
//     <form
//       noValidate
//       onSubmit={formik.handleSubmit}
//       className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-start"
//     >
//       <label className="space-y-1 text-sm font-semibold text-gray-700">
//         ترتيب حسب
//         <select {...formik.getFieldProps("sort")} className={fieldClass}>
//           <option value="newest">الأحدث</option>
//           <option value="oldest">الأقدم</option>
//           <option value="price_asc">السعر: من الأقل للأعلى</option>
//           <option value="price_desc">السعر: من الأعلى للأقل</option>
//         </select>
//       </label>

//       <label className="space-y-1 text-sm font-semibold text-gray-700">
//         أقل سعر
//         <input
//           type="number"
//           min={0}
//           inputMode="decimal"
//           placeholder="0"
//           {...formik.getFieldProps("minPrice")}
//           className={fieldClass}
//         />
//         {priceError("minPrice") && (
//           <span className="block text-xs font-normal text-red-600">
//             {formik.errors.minPrice}
//           </span>
//         )}
//       </label>

//       <label className="space-y-1 text-sm font-semibold text-gray-700">
//         أعلى سعر
//         <input
//           type="number"
//           min={0}
//           inputMode="decimal"
//           placeholder="بدون حد"
//           {...formik.getFieldProps("maxPrice")}
//           className={fieldClass}
//         />
//         {priceError("maxPrice") && (
//           <span className="block text-xs font-normal text-red-600">
//             {formik.errors.maxPrice}
//           </span>
//         )}
//       </label>

//       <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 lg:mt-7">
//         <input
//           type="checkbox"
//           {...formik.getFieldProps({ name: "inStock", type: "checkbox" })}
//           className="h-4 w-4 accent-blue-600"
//         />
//         المتوفر فقط
//       </label>

//       <div className="flex gap-2 sm:col-span-2 lg:col-span-1 lg:mt-6">
//         <button
//           type="submit"
//           className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
//         >
//           تطبيق
//         </button>
//         <button
//           type="button"
//           onClick={() => go(new URLSearchParams(preserved))}
//           className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
//         >
//           مسح
//         </button>
//       </div>
//     </form>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { zodValidate } from "@/lib/zodValidate";
import {
  productFiltersSchema,
  type ProductFiltersValues,
} from "@/lib/validations/products";

interface ProductFiltersProps {
  initial: ProductFiltersValues;
  preserved: Record<string, string>;
}

const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#6366f1] focus:bg-white focus:ring-4 focus:ring-[#6366f1]/10";

export default function ProductFilters({
  initial,
  preserved,
}: ProductFiltersProps) {
  const router = useRouter();

  function go(params: URLSearchParams) {
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  const formik = useFormik<ProductFiltersValues>({
    initialValues: initial,
    enableReinitialize: true,
    validate: zodValidate(productFiltersSchema),
    onSubmit: (values) => {
      const params = new URLSearchParams(preserved);

      if (values.sort !== "newest") params.set("sort", values.sort);

      if (values.minPrice.trim()) {
        params.set("minPrice", values.minPrice.trim());
      }

      if (values.maxPrice.trim()) {
        params.set("maxPrice", values.maxPrice.trim());
      }

      if (values.inStock) params.set("inStock", "true");

      go(params);
    },
  });

  const priceError = (name: "minPrice" | "maxPrice") =>
    formik.touched[name] && formik.errors[name];

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 lg:p-6"
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">تصفية المنتجات</h2>
          <p className="mt-1 text-xs text-gray-400">
            حدد اختياراتك للوصول للمنتج المناسب
          </p>
        </div>

        <button
          type="button"
          onClick={() => go(new URLSearchParams(preserved))}
          className="shrink-0 text-xs font-semibold text-gray-500 transition hover:text-[#6366f1]"
        >
          إعادة ضبط
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto_auto] lg:items-end">
        <label className="block space-y-2">
          <span className="text-xs font-semibold text-gray-600">
            ترتيب المنتجات
          </span>

          <select {...formik.getFieldProps("sort")} className={fieldClass}>
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="price_asc">السعر من الأقل للأعلى</option>
            <option value="price_desc">السعر من الأعلى للأقل</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold text-gray-600">أقل سعر</span>

          <input
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="من"
            {...formik.getFieldProps("minPrice")}
            className={fieldClass}
          />

          {priceError("minPrice") && (
            <span className="block text-xs font-normal text-red-600">
              {formik.errors.minPrice}
            </span>
          )}
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-semibold text-gray-600">أعلى سعر</span>

          <input
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="إلى"
            {...formik.getFieldProps("maxPrice")}
            className={fieldClass}
          />

          {priceError("maxPrice") && (
            <span className="block text-xs font-normal text-red-600">
              {formik.errors.maxPrice}
            </span>
          )}
        </label>

        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-3.5 text-xs font-semibold text-gray-700 transition hover:border-[#c7c5ff]">
          <input
            type="checkbox"
            {...formik.getFieldProps({
              name: "inStock",
              type: "checkbox",
            })}
            className="h-4 w-4 rounded border-gray-300 accent-[#6366f1]"
          />
          المتوفر فقط
        </label>

        <button
          type="submit"
          className="min-h-11 rounded-xl bg-[#6366f1] px-6 text-sm font-semibold text-white transition hover:bg-[#5149df] focus:outline-none focus:ring-4 focus:ring-[#6366f1]/20"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </form>
  );
}
