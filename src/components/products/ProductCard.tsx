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
  const { min, max } = getPriceRange(product);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_14px_35px_rgba(17,24,39,0.08)]"
    >
      <div className="relative m-2.5 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f7f7fa] sm:m-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105 sm:p-5"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">
            <FaImage />
          </div>
        )}

        {outOfStock && (
          <span className="absolute start-2 top-2 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-red-600 shadow-sm sm:start-3 sm:top-3 sm:text-xs">
            غير متوفر
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-4 pt-1 sm:px-4 sm:pb-5">
        {product.brand && (
          <span className="mb-2 w-fit text-[11px] font-semibold text-gray-400 sm:text-xs">
            {product.brand.name}
          </span>
        )}

        <h3 className="line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-gray-800 transition-colors group-hover:text-[#6366f1] sm:text-sm sm:leading-6">
          {product.title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
          <p className="text-sm font-bold text-[#6366f1] sm:text-base">
            {min !== max && (
              <span className="mb-1 block text-[10px] font-medium text-gray-400 sm:text-xs">
                ابتداءً من
              </span>
            )}
            {formatPrice(min)}
          </p>

          <span className="pb-0.5 text-[10px] font-medium text-gray-400 transition-colors group-hover:text-[#6366f1] sm:text-xs">
            التفاصيل
          </span>
        </div>
      </div>
    </Link>
  );
}
