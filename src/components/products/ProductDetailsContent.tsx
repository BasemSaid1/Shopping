// import Link from "next/link";
// import { notFound } from "next/navigation";
// import axios from "axios";
// import { FaExclamationTriangle } from "react-icons/fa";
// import { getProduct } from "@/services/products";
// import { getImageUrl } from "@/lib/image";
// import type { Product } from "@/types";
// import ProductGallery from "./ProductGallery";
// import ProductPurchase from "./ProductPurchase";
// import ReviewsSection from "@/components/reviews/ReviewsSection";

// const MONGO_ID = /^[a-f\d]{24}$/i;

// export default async function ProductDetailsContent({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;

//   if (!MONGO_ID.test(id)) notFound();

//   let product: Product | null = null;
//   let missing = false;

//   try {
//     product = await getProduct(id);
//   } catch (error) {
//     const status = axios.isAxiosError(error) ? error.response?.status : null;
//     if (status === 400 || status === 404) missing = true;
//   }

//   if (missing) notFound();

//   if (!product) {
//     return (
//       <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
//         <FaExclamationTriangle className="text-4xl" />
//         <p className="font-semibold">تعذر تحميل المنتج، حاول مرة أخرى</p>
//       </div>
//     );
//   }

//   const images = [
//     ...new Set(
//       [product.image, ...(product.gallery ?? [])]
//         .map(getImageUrl)
//         .filter((url): url is string => Boolean(url)),
//     ),
//   ];

//   return (
//     <>
//       <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
//         <Link href="/" className="hover:text-blue-600">
//           الرئيسية
//         </Link>
//         <span>/</span>
//         <Link href="/products" className="hover:text-blue-600">
//           المنتجات
//         </Link>
//         <span>/</span>
//         <span className="line-clamp-1 text-gray-800">{product.title}</span>
//       </nav>

//       <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
//         <ProductGallery
//           key={product._id}
//           images={images}
//           title={product.title}
//         />

//         <div className="space-y-5">
//           <div className="flex flex-wrap items-center gap-2 text-sm">
//             {product.category && (
//               <Link
//                 href={`/products?category=${product.category._id}`}
//                 className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600 hover:bg-blue-100"
//               >
//                 {product.category.name}
//               </Link>
//             )}
//             {product.brand && (
//               <Link
//                 href={`/products?brand=${product.brand._id}`}
//                 className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700 hover:bg-gray-200"
//               >
//                 {product.brand.name}
//               </Link>
//             )}
//           </div>

//           <h1 className="text-2xl font-bold leading-snug text-gray-900 lg:text-3xl">
//             {product.title}
//           </h1>

//           <ProductPurchase product={product}>
//             {product.description && (
//               <p className="whitespace-pre-line leading-8 text-gray-600">
//                 {product.description}
//               </p>
//             )}
//           </ProductPurchase>
//         </div>
//       </div>
//       <ReviewsSection productId={product._id} />
//     </>
//   );
// }

import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";
import {
  FaExclamationTriangle,
  FaChevronLeft,
  FaCheckCircle,
  FaBoxOpen,
  FaTag,
} from "react-icons/fa";
import { getProduct } from "@/services/products";
import { getImageUrl } from "@/lib/image";
import type { Product } from "@/types";
import ProductGallery from "./ProductGallery";
import ProductPurchase from "./ProductPurchase";
import ReviewsSection from "@/components/reviews/ReviewsSection";

const MONGO_ID = /^[a-f\d]{24}$/i;

export default async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!MONGO_ID.test(id)) notFound();

  let product: Product | null = null;
  let missing = false;

  try {
    product = await getProduct(id);
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : null;

    if (status === 400 || status === 404) missing = true;
  }

  if (missing) notFound();

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white py-20 text-red-600 shadow-sm">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-semibold">تعذر تحميل المنتج، حاول مرة أخرى</p>
      </div>
    );
  }

  const images = [
    ...new Set(
      [product.image, ...(product.gallery ?? [])]
        .map(getImageUrl)
        .filter((url): url is string => Boolean(url)),
    ),
  ];

  return (
    <>
      <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="transition hover:text-[#6366f1]">
          الرئيسية
        </Link>

        <FaChevronLeft className="text-[10px]" />

        <Link href="/products" className="transition hover:text-[#6366f1]">
          المنتجات
        </Link>

        <FaChevronLeft className="text-[10px]" />

        <span className="line-clamp-1 font-semibold text-gray-700">
          {product.title}
        </span>
      </nav>

      <section className="grid items-start gap-7 lg:grid-cols-2 lg:gap-10">
        <ProductGallery
          key={product._id}
          images={images}
          title={product.title}
        />

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {product.brand && (
              <Link
                href={`/products?brand=${product.brand._id}`}
                className="rounded-full bg-[#f0efff] px-4 py-2 text-xs font-bold text-[#6366f1] transition hover:bg-[#e8e7ff]"
              >
                {product.brand.name}
              </Link>
            )}

            {product.category && (
              <Link
                href={`/products?category=${product.category._id}`}
                className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
              >
                {product.category.name}
              </Link>
            )}
          </div>

          <h1 className="text-2xl font-extrabold leading-relaxed text-gray-900 sm:text-3xl">
            {product.title}
          </h1>

          <div className="my-6 h-px bg-gray-100" />

          <ProductPurchase product={product}>
            {product.description && (
              <div className="rounded-2xl bg-[#f8f8fb] p-4 sm:p-5">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <FaTag className="text-[#6366f1]" />
                  وصف المنتج
                </h2>

                <p className="whitespace-pre-line text-sm leading-8 text-gray-500">
                  {product.description}
                </p>
              </div>
            )}
          </ProductPurchase>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#f8f8fb] p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eeedff] text-[#6366f1]">
                <FaCheckCircle />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-800">جودة مميزة</p>
                <p className="mt-1 text-[10px] text-gray-400">
                  تجربة تسوق أفضل
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-[#f8f8fb] p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eeedff] text-[#6366f1]">
                <FaBoxOpen />
              </span>
              <div>
                <p className="text-xs font-bold text-gray-800">تفاصيل واضحة</p>
                <p className="mt-1 text-[10px] text-gray-400">اختر ما يناسبك</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection productId={product._id} />
    </>
  );
}
