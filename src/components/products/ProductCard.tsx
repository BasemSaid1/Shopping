// import Link from "next/link";
// import { FaImage } from "react-icons/fa";
// import type { Product } from "@/types";
// import { getImageUrl } from "@/lib/image";
// import { formatPrice } from "@/lib/format";
// import { getPriceRange } from "@/lib/variants";

// export default function ProductCard({ product }: { product: Product }) {
//   const image = getImageUrl(product.image);
//   const outOfStock = product.stock === 0;
//   const { min, max } = getPriceRange(product);

//   return (
//     <Link
//       href={`/products/${product._id}`}
//       className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
//     >
//       <div className="relative aspect-square overflow-hidden bg-gray-100">
//         {image ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={image}
//             alt={product.title}
//             loading="lazy"
//             className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center text-4xl text-gray-300">
//             <FaImage />
//           </div>
//         )}
//         {outOfStock && (
//           <span className="absolute start-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
//             غير متوفر
//           </span>
//         )}
//       </div>

//       <div className="flex flex-1 flex-col gap-2 p-4">
//         {product.brand && (
//           <span className="text-xs text-gray-500">{product.brand.name}</span>
//         )}
//         <h3 className="line-clamp-2 font-semibold text-gray-800">
//           {product.title}
//         </h3>
//         <p className="mt-auto pt-2 text-lg font-bold text-blue-600">
//           {min !== max && (
//             <span className="me-1 text-xs font-semibold text-gray-500">
//               ابتداءً من
//             </span>
//           )}
//           {formatPrice(min)}
//         </p>
//       </div>
//     </Link>
//   );
// }

import Link from "next/link";
import { FaImage, FaArrowLeft, FaLayerGroup } from "react-icons/fa";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/format";
import { getPriceRange } from "@/lib/variants";

export default function ProductCard({ product }: { product: Product }) {
  const image = getImageUrl(product.image);
  const outOfStock = product.stock === 0;
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const { min, max } = getPriceRange(product);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex h-full flex-col rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#f5f5f7]">
        <div className="relative aspect-[4/4.5] w-full overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-110 sm:p-7"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-gray-300">
              <FaImage />
            </div>
          )}
        </div>

        {/* Product Badges */}
        <div className="absolute start-3 top-3 flex flex-col items-start gap-2">
          {outOfStock && (
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-red-500 shadow-sm">
              غير متوفر
            </span>
          )}

          {hasVariants && (
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-gray-600 shadow-sm backdrop-blur-sm">
              <FaLayerGroup className="text-[#6366f1]" />
              خيارات متعددة
            </span>
          )}
        </div>

        {/* Hover Action */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/95 py-3 text-xs font-bold text-gray-800 shadow-lg backdrop-blur-sm">
            عرض تفاصيل المنتج
            <FaArrowLeft className="text-[#6366f1]" />
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col px-1 pb-3 pt-4 sm:pt-5">
        {/* Brand & Category */}
        <div className="mb-2 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
          {product.brand && (
            <span className="text-xs font-bold uppercase tracking-wide text-[#6366f1]">
              {product.brand.name}
            </span>
          )}

          {product.brand && product.category && (
            <span className="h-1 w-1 rounded-full bg-gray-300" />
          )}

          {product.category && (
            <span className="text-[11px] font-medium text-gray-400">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-gray-900 transition-colors duration-200 group-hover:text-[#6366f1] sm:text-base">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
          <div>
            {min !== max && (
              <span className="mb-1 block text-[10px] font-medium text-gray-400">
                السعر يبدأ من
              </span>
            )}

            <p className="text-base font-extrabold tracking-tight text-gray-900 sm:text-lg">
              {formatPrice(min)}
            </p>

            {min !== max && (
              <span className="mt-1 block text-[10px] text-gray-400">
                حتى {formatPrice(max)}
              </span>
            )}
          </div>

          <span className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f0ff] text-[#6366f1] transition-all duration-300 group-hover:bg-[#6366f1] group-hover:text-white">
            <FaArrowLeft className="text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
