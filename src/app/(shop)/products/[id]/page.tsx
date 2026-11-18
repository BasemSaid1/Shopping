// import { Suspense } from "react";
// import ProductDetailsContent from "@/components/products/ProductDetailsContent";
// import ProductDetailsSkeleton from "@/components/products/ProductDetailsSkeleton";

// export default function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8">
//       <Suspense fallback={<ProductDetailsSkeleton />}>
//         <ProductDetailsContent params={params} />
//       </Suspense>
//     </div>
//   );
// }

import { Suspense } from "react";
import ProductDetailsContent from "@/components/products/ProductDetailsContent";
import ProductDetailsSkeleton from "@/components/products/ProductDetailsSkeleton";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <Suspense fallback={<ProductDetailsSkeleton />}>
          <ProductDetailsContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}
