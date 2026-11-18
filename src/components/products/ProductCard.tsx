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
import { FaImage } from "react-icons/fa";
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#dcdafe] hover:shadow-[0_12px_30px_rgba(30,30,60,0.07)] sm:p-4"
    >
      {/* Image */}
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f5f5f7]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105 sm:p-7"
          />
        ) : (
          <FaImage className="text-5xl text-gray-300" />
        )}
      </div>

      {/* Information */}
      <div className="flex flex-1 flex-col pt-4">
        {product.brand && (
          <p className="mb-2 text-xs font-bold tracking-wide text-[#6366f1]">
            {product.brand.name}
          </p>
        )}

        <h3 className="line-clamp-2 min-h-12 text-sm font-semibold leading-6 text-gray-900 transition-colors group-hover:text-[#6366f1] sm:text-base">
          {product.title}
        </h3>

        {product.category && (
          <p className="mt-1 text-xs text-gray-400">{product.category.name}</p>
        )}

        {hasVariants && (
          <p className="mt-2 text-[11px] text-gray-500">
            متوفر بأكثر من اختيار
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="mb-3 h-px w-full bg-gray-100" />

          <div className="flex min-h-10 items-end justify-between gap-2">
            <div>
              {min !== max && (
                <p className="mb-1 text-[10px] text-gray-400">السعر يبدأ من</p>
              )}

              <p className="text-base font-extrabold text-gray-900 sm:text-lg">
                {formatPrice(min)}
              </p>

              {min !== max && (
                <p className="mt-1 text-[10px] text-gray-400">
                  حتى {formatPrice(max)}
                </p>
              )}
            </div>

            {outOfStock ? (
              <span className="rounded-lg bg-red-50 px-2.5 py-2 text-[10px] font-semibold text-red-500">
                غير متوفر
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#6366f1] transition-transform group-hover:-translate-x-1">
                التفاصيل ←
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
