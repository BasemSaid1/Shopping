// import { Suspense } from "react";
// import ProductsContent from "@/components/products/ProductsContent";
// import ProductsSkeleton from "@/components/products/ProductsSkeleton";

// export default function ProductsPage({
//   searchParams,
// }: {
//   searchParams: Promise<Record<string, string | string[] | undefined>>;
// }) {
//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8">
//       <h1 className="mb-6 text-2xl font-bold text-gray-800">المنتجات</h1>

//       <Suspense fallback={<ProductsSkeleton />}>
//         <ProductsContent searchParams={searchParams} />
//       </Suspense>
//     </div>
//   );
// }

import { Suspense } from "react";
import ProductsContent from "@/components/products/ProductsContent";
import ProductsSkeleton from "@/components/products/ProductsSkeleton";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold tracking-wide text-[#6366f1]">
          اكتشف مجموعتنا
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          المنتجات
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
          اختار المنتج المناسب ليك من مجموعة متنوعة من المنتجات.
        </p>
      </div>

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
