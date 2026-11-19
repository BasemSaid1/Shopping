import Link from "next/link";
import { getBrands } from "@/services/brands";
import type { Brand } from "@/types";

const MIN_ITEMS = 8;

export function BrandsTickerFallback() {
  return <div aria-hidden="true" className="h-[68px] bg-[#101536]" />;
}

function Item({ brand, hidden }: { brand: Brand; hidden?: boolean }) {
  return (
    <li className="flex items-center gap-8 ps-8">
      <Link
        href={`/products?brand=${brand._id}`}
        tabIndex={hidden ? -1 : undefined}
        className="whitespace-nowrap text-2xl font-black text-white transition hover:text-[#FFD93D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD93D]"
      >
        {brand.name}
      </Link>
      {/* <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-[#FF5C47]" /> */}
    </li>
  );
}

export default async function BrandsTicker() {
  let brands: Brand[] = [];

  try {
    brands = await getBrands();
  } catch {
    brands = [];
  }

  if (!brands || brands.length === 0) return null;

  // لو الماركات قليلة نكررها عشان الشريط ما يبانش فاضي
  const repeat = Math.ceil(MIN_ITEMS / brands.length);
  const set = Array.from({ length: repeat }).flatMap(() => brands);
  const duration = `${Math.max(24, set.length * 4)}s`;

  return (
    <section
      aria-label="الماركات"
      className="marquee overflow-hidden border-y border-[#101536] bg-[#101536] py-4"
    >
      <div
        className="marquee-track flex w-max"
        style={{ "--dur": duration } as React.CSSProperties}
      >
        <ul className="flex shrink-0">
          {set.map((brand, i) => (
            <Item key={`a-${i}`} brand={brand} />
          ))}
        </ul>
        <ul className="flex shrink-0" aria-hidden="true">
          {set.map((brand, i) => (
            <Item key={`b-${i}`} brand={brand} hidden />
          ))}
        </ul>
      </div>
    </section>
  );
}
