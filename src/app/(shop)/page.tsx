import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import LatestProducts from "@/components/home/LatestProducts";
import LatestProductsSkeleton from "@/components/home/LatestProductsSkeleton";
import Explore from "@/components/home/Explore";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Suspense fallback={<LatestProductsSkeleton />}>
        <LatestProducts />
      </Suspense>
      <Explore />
    </>
  );
}
