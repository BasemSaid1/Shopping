// import Link from "next/link";
// import { getBrands } from "@/services/brands";
// import type { Brand } from "@/types";

// const MIN_ITEMS = 8;

// export function BrandsTickerFallback() {
//   return <div aria-hidden="true" className="h-[68px] bg-[#101536]" />;
// }

// function Item({ brand, hidden }: { brand: Brand; hidden?: boolean }) {
//   return (
//     <li className="flex items-center gap-8 ps-8">
//       <Link
//         href={`/products?brand=${brand._id}`}
//         tabIndex={hidden ? -1 : undefined}
//         className="whitespace-nowrap text-2xl font-black text-white transition hover:text-[#FFD93D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD93D]"
//       >
//         {brand.name}
//       </Link>
//       <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-[#FF5C47]" />
//     </li>
//   );
// }

// export default async function BrandsTicker() {
//   let brands: Brand[] = [];

//   try {
//     brands = await getBrands();
//   } catch {
//     brands = [];
//   }

//   if (!brands || brands.length === 0) return null;

//   // لو الماركات قليلة نكررها عشان الشريط ما يبانش فاضي
//   const repeat = Math.ceil(MIN_ITEMS / brands.length);
//   const set = Array.from({ length: repeat }).flatMap(() => brands);
//   const duration = `${Math.max(24, set.length * 4)}s`;

//   return (
//     <section
//       aria-label="الماركات"
//       className="marquee overflow-hidden border-y border-[#101536] bg-[#101536] py-4"
//     >
//       <div
//         className="marquee-track flex w-max"
//         style={{ "--dur": duration } as React.CSSProperties}
//       >
//         <ul className="flex shrink-0">
//           {set.map((brand, i) => (
//             <Item key={`a-${i}`} brand={brand} />
//           ))}
//         </ul>
//         <ul className="flex shrink-0" aria-hidden="true">
//           {set.map((brand, i) => (
//             <Item key={`b-${i}`} brand={brand} hidden />
//           ))}
//         </ul>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";
import { getBrands } from "@/services/brands";
import type { Brand } from "@/types";

export function BrandsTickerFallback() {
  return (
    <section aria-hidden="true" className="bg-[#f5f5f7] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 min-w-52 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/products?brand=${brand._id}`}
      className="group flex h-32 w-52 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6366f1]/30 hover:shadow-lg hover:shadow-[#6366f1]/10"
    >
      <span className="line-clamp-1 text-2xl font-black tracking-wide text-gray-900 transition-colors group-hover:text-[#6366f1]">
        {brand.name}
      </span>

      <span className="text-xs font-medium text-gray-400 transition-colors group-hover:text-[#6366f1]">
        اكتشف المنتجات
      </span>
    </Link>
  );
}

export default async function BrandsTicker() {
  let brands: Brand[] = [];

  try {
    brands = await getBrands();
  } catch {
    brands = [];
  }

  if (!brands?.length) return null;

  const repeat = Math.max(2, Math.ceil(10 / brands.length));

  const set = Array.from({ length: repeat }, () => brands).flat();

  return (
    <section
      aria-label="الماركات"
      className="overflow-hidden bg-[#f5f5f7] py-10 sm:py-14"
    >
      <div className="mx-auto mb-7 flex max-w-7xl items-end justify-between gap-4 px-4 sm:mb-9 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
            تسوّق حسب الماركة
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            اكتشف منتجات أشهر العلامات التجارية
          </p>
        </div>

        <Link
          href="/brands"
          className="shrink-0 text-sm font-bold text-[#6366f1] transition-colors hover:text-[#4f46e5]"
        >
          كل الماركات ←
        </Link>
      </div>

      <div className="brands-slider group relative overflow-hidden">
        <div className="brands-track flex w-max gap-4">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 gap-4"
              aria-hidden={group === 1}
            >
              {set.map((brand, index) => (
                <BrandCard
                  key={`${group}-${brand._id}-${index}`}
                  brand={brand}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .brands-track {
          animation: brands-scroll 35s linear infinite;
          direction: ltr;
        }

        .brands-slider:hover .brands-track {
          animation-play-state: paused;
        }

        @keyframes brands-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .brands-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
