import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import LatestProducts from "@/components/home/LatestProducts";
import LatestProductsSkeleton from "@/components/home/LatestProductsSkeleton";
import Explore from "@/components/home/Explore";
import BrandsTicker, {
  BrandsTickerFallback,
} from "@/components/home/BrandsTicker";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<BrandsTickerFallback />}>
        <BrandsTicker />
      </Suspense>
      <Features />
      <Suspense fallback={<LatestProductsSkeleton />}>
        <LatestProducts />
      </Suspense>
      <Explore />
    </>
  );
}
