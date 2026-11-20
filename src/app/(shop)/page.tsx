import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import LatestProducts from "@/components/home/LatestProducts";
import LatestProductsSkeleton from "@/components/home/LatestProductsSkeleton";
import Closing from "@/components/home/Closing";
import BrandsTicker, {
  BrandsTickerFallback,
} from "@/components/home/BrandsTicker";
import CategoriesGrid, {
  CategoriesGridFallback,
} from "@/components/home/CategoriesGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<BrandsTickerFallback />}>
        <BrandsTicker />
      </Suspense>
      <Suspense fallback={<CategoriesGridFallback />}>
        <CategoriesGrid />
      </Suspense>
      <Suspense fallback={<LatestProductsSkeleton />}>
        <LatestProducts />
      </Suspense>
      <Closing />
    </>
  );
}
