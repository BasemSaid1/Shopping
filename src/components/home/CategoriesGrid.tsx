import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { getCategories } from "@/services/categories";
import { getImageUrl } from "@/lib/image";
import type { Category } from "@/types";

const MAX_CATEGORIES = 5;

const HEADING = (
  <div className="mb-8 flex items-end justify-between gap-4">
    <h2 className="text-3xl font-black text-[#101536] sm:text-4xl">
      تسوّق حسب الفئة
    </h2>
    <Link
      href="/categories"
      className="shrink-0 text-sm font-bold text-[#101536] underline decoration-2 underline-offset-8 hover:decoration-[#FF5C47]"
    >
      كل الفئات
    </Link>
  </div>
);

// أول فئة بتتعرض كبيرة (لو فيه 5)، والباقي صغير
function tileClass(index: number, total: number) {
  const big = total === 5 && index === 0;
  return big
    ? "col-span-2 row-span-2 min-h-[320px] lg:min-h-[420px]"
    : "min-h-[150px] lg:min-h-[200px]";
}

const GRID = "grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4";

export function CategoriesGridFallback() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      {HEADING}
      <div aria-hidden="true" className={GRID}>
        {Array.from({ length: MAX_CATEGORIES }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse rounded-3xl bg-[#e9ebf5] ${tileClass(i, MAX_CATEGORIES)}`}
          />
        ))}
      </div>
    </section>
  );
}

function Tile({
  category,
  className,
}: {
  category: Category;
  className: string;
}) {
  const image = getImageUrl(category.logo);

  return (
    <Link
      href={`/products?category=${category._id}`}
      className={`group relative isolate flex items-end overflow-hidden rounded-3xl bg-[#e9ebf5] p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101536] ${className}`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 flex items-center justify-center text-8xl font-black text-[#101536]/10"
        >
          {category.name.charAt(0)}
        </span>
      )}

      {image && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#101536]/80 via-[#101536]/10 to-transparent"
        />
      )}

      <span className="flex w-full items-center justify-between gap-3">
        <span
          className={`text-lg font-black sm:text-xl ${image ? "text-white" : "text-[#101536]"}`}
        >
          {category.name}
        </span>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD93D] text-[#101536] transition group-hover:bg-[#FF5C47] group-hover:text-white">
          <FaArrowLeft aria-hidden="true" />
        </span>
      </span>
    </Link>
  );
}

export default async function CategoriesGrid() {
  let categories: Category[] = [];

  try {
    categories = (await getCategories()) ?? [];
  } catch {
    categories = [];
  }

  if (categories.length === 0) return null;

  const shown = categories.slice(0, MAX_CATEGORIES);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
      {HEADING}
      <div className={GRID}>
        {shown.map((category, i) => (
          <Tile
            key={category._id}
            category={category}
            className={tileClass(i, shown.length)}
          />
        ))}
      </div>
    </section>
  );
}
