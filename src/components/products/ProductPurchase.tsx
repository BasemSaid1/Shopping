// "use client";

// import { useState } from "react";
// import { formatPrice } from "@/lib/format";
// import { getPriceRange } from "@/lib/variants";
// import type { Product } from "@/types";
// import AddToCartButton from "./AddToCartButton";

// function StockBadge({ stock }: { stock: number }) {
//   if (stock === 0) {
//     return (
//       <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
//         غير متوفر
//       </span>
//     );
//   }
//   if (stock <= 5) {
//     return (
//       <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
//         متبقي {stock.toLocaleString("ar-EG")} فقط
//       </span>
//     );
//   }
//   return (
//     <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
//       متوفر
//     </span>
//   );
// }

// export default function ProductPurchase({
//   product,
//   children,
// }: {
//   product: Product;
//   children?: React.ReactNode;
// }) {
//   const options = product.options ?? [];
//   const variants = product.variants ?? [];
//   const hasVariants = options.length > 0 && variants.length > 0;

//   const [selected, setSelected] = useState<Record<string, string>>(() => {
//     const initial: Record<string, string> = {};
//     if (variants.length === 1) {
//       for (const a of variants[0].attributes) initial[a.name] = a.value;
//     } else {
//       for (const o of options) {
//         if (o.values.length === 1) initial[o.name] = o.values[0];
//       }
//     }
//     return initial;
//   });

//   const matches = (v: (typeof variants)[number], sel: Record<string, string>) =>
//     v.attributes.every((a) => !sel[a.name] || sel[a.name] === a.value);

//   const missing = options.filter((o) => !selected[o.name]);
//   const selectedVariant =
//     hasVariants && missing.length === 0
//       ? variants.find((v) => matches(v, selected))
//       : undefined;

//   // السعر: للتركيبة المختارة، أو من أقل سعر للتركيبات المطابقة لاختياراتك
//   const candidates = variants.filter((v) => matches(v, selected));
//   const range = getPriceRange({
//     price: product.price,
//     variants: candidates.length > 0 ? candidates : variants,
//   });
//   const price = selectedVariant ? selectedVariant.price : range.min;
//   const isRange = !selectedVariant && hasVariants && range.min !== range.max;

//   const stock = selectedVariant ? selectedVariant.stock : product.stock;

//   // قيمة مش متاحة = مفيش تركيبة فيها مخزون تجمعها مع باقي اختياراتك
//   function isAvailable(optionName: string, value: string) {
//     return variants.some(
//       (v) =>
//         v.stock > 0 &&
//         v.attributes.some((a) => a.name === optionName && a.value === value) &&
//         matches(v, { ...selected, [optionName]: value }),
//     );
//   }

//   function toggle(optionName: string, value: string) {
//     setSelected((s) => {
//       const next = { ...s };
//       if (next[optionName] === value) delete next[optionName];
//       else next[optionName] = value;
//       return next;
//     });
//   }

//   const blockedReason =
//     hasVariants && !selectedVariant
//       ? missing.length > 0
//         ? `اختر ${missing.map((o) => o.name).join(" و")}`
//         : "هذه التركيبة غير متاحة"
//       : undefined;

//   return (
//     <>
//       <div className="flex flex-wrap items-center gap-4">
//         <p className="text-3xl font-bold text-blue-600">
//           {isRange && (
//             <span className="me-2 text-base font-semibold text-gray-500">
//               ابتداءً من
//             </span>
//           )}
//           {formatPrice(price)}
//         </p>
//         <StockBadge stock={stock} />
//       </div>

//       {children}

//       {hasVariants && (
//         <div className="space-y-4">
//           {options.map((option) => (
//             <div key={option.name}>
//               <p className="mb-2 text-sm font-semibold text-gray-700">
//                 {option.name}
//                 {selected[option.name] && (
//                   <span className="ms-2 font-normal text-gray-500">
//                     {selected[option.name]}
//                   </span>
//                 )}
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {option.values.map((value) => {
//                   const active = selected[option.name] === value;
//                   const available = isAvailable(option.name, value);
//                   return (
//                     <button
//                       key={value}
//                       type="button"
//                       aria-pressed={active}
//                       onClick={() => toggle(option.name, value)}
//                       className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
//                         active
//                           ? "border-blue-600 bg-blue-50 text-blue-700"
//                           : available
//                             ? "border-gray-300 text-gray-700 hover:border-blue-400"
//                             : "border-gray-200 text-gray-400 line-through hover:border-gray-300"
//                       }`}
//                     >
//                       {value}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="border-t border-gray-200 pt-5">
//         <AddToCartButton
//           key={selectedVariant?._id ?? "none"}
//           productId={product._id}
//           variantId={selectedVariant?._id}
//           stock={stock}
//           blockedReason={blockedReason}
//         />
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { FaCheck, FaStore } from "react-icons/fa";
import { formatPrice } from "@/lib/format";
import { getPriceRange } from "@/lib/variants";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        غير متوفر
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        متبقي {stock.toLocaleString("ar-EG")} فقط
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-600">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      متوفر
    </span>
  );
}

export default function ProductPurchase({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  const options = product.options ?? [];
  const variants = product.variants ?? [];
  const hasVariants = options.length > 0 && variants.length > 0;

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};

    if (variants.length === 1) {
      for (const a of variants[0].attributes) {
        initial[a.name] = a.value;
      }
    } else {
      for (const o of options) {
        if (o.values.length === 1) {
          initial[o.name] = o.values[0];
        }
      }
    }

    return initial;
  });

  const matches = (v: (typeof variants)[number], sel: Record<string, string>) =>
    v.attributes.every((a) => !sel[a.name] || sel[a.name] === a.value);

  const missing = options.filter((o) => !selected[o.name]);

  const selectedVariant =
    hasVariants && missing.length === 0
      ? variants.find((v) => matches(v, selected))
      : undefined;

  const candidates = variants.filter((v) => matches(v, selected));

  const range = getPriceRange({
    price: product.price,
    variants: candidates.length > 0 ? candidates : variants,
  });

  const price = selectedVariant ? selectedVariant.price : range.min;
  const isRange = !selectedVariant && hasVariants && range.min !== range.max;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;

  function isAvailable(optionName: string, value: string) {
    return variants.some(
      (v) =>
        v.stock > 0 &&
        v.attributes.some((a) => a.name === optionName && a.value === value) &&
        matches(v, { ...selected, [optionName]: value }),
    );
  }

  function toggle(optionName: string, value: string) {
    setSelected((s) => {
      const next = { ...s };

      if (next[optionName] === value) {
        delete next[optionName];
      } else {
        next[optionName] = value;
      }

      return next;
    });
  }

  const blockedReason =
    hasVariants && !selectedVariant
      ? missing.length > 0
        ? `اختر ${missing.map((o) => o.name).join(" و")}`
        : "هذه التركيبة غير متاحة"
      : undefined;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#f8f8fb] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {isRange && (
              <p className="mb-1 text-xs font-semibold text-gray-400">
                السعر يبدأ من
              </p>
            )}

            <p className="text-3xl font-extrabold tracking-tight text-[#6366f1]">
              {formatPrice(price)}
            </p>

            {isRange && (
              <p className="mt-1 text-xs text-gray-400">
                تختلف الأسعار حسب الاختيار
              </p>
            )}
          </div>

          <StockBadge stock={stock} />
        </div>
      </div>

      {children}

      {hasVariants && (
        <div className="space-y-6">
          {options.map((option) => (
            <div key={option.name}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-bold text-gray-800">{option.name}</p>

                {selected[option.name] && (
                  <span className="rounded-lg bg-[#f0efff] px-3 py-1 text-xs font-bold text-[#6366f1]">
                    {selected[option.name]}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = selected[option.name] === value;
                  const available = isAvailable(option.name, value);

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(option.name, value)}
                      className={`flex min-h-11 min-w-12 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-200 ${
                        active
                          ? "border-[#6366f1] bg-[#6366f1] text-white shadow-md shadow-indigo-100"
                          : available
                            ? "border-gray-200 bg-white text-gray-700 hover:border-[#a5a2ff] hover:bg-[#f8f7ff]"
                            : "border-gray-100 bg-gray-50 text-gray-300 line-through hover:border-gray-200"
                      }`}
                    >
                      {active && <FaCheck className="text-xs" />}
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700">
          <FaStore className="text-[#6366f1]" />
          حالة المنتج
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">التوفر في المخزون</span>
          <span
            className={
              stock > 0 ? "font-bold text-green-600" : "font-bold text-red-500"
            }
          >
            {stock > 0 ? "متوفر للشراء" : "نفد المخزون"}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <AddToCartButton
          key={selectedVariant?._id ?? "none"}
          productId={product._id}
          variantId={selectedVariant?._id}
          stock={stock}
          blockedReason={blockedReason}
        />
      </div>
    </div>
  );
}
