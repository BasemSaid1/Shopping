import Link from "next/link";
import { FaImage } from "react-icons/fa";
import { getProducts } from "@/services/products";
import { getImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/format";
import { getPriceRange } from "@/lib/variants";
import type { Product } from "@/types";

// مكان وزاوية كل بطاقة (r: الزاوية / d: تأخير الحركة / pos: المكان)
const SLOTS = [
  { r: "-7deg", d: "0.1s", pos: "start-[4%] top-8", extra: "" },
  { r: "4deg", d: "0.25s", pos: "start-[29%] top-20", extra: "" },
  { r: "11deg", d: "0.4s", pos: "start-[52%] top-6", extra: "hidden sm:block" },
];

const HEIGHT = "h-[430px] sm:h-[480px] lg:h-[560px]";

export function HeroTagsFallback() {
  return (
    <div aria-hidden="true" className={`relative ${HEIGHT}`}>
      {SLOTS.map((slot, i) => (
        <div
          key={i}
          className={`absolute w-[200px] sm:w-[220px] ${slot.pos} ${slot.extra}`}
        >
          <div className="mx-auto h-10 w-0.5 bg-[#101536]/20" />
          <div className="h-[290px] rounded-3xl bg-white/40" />
        </div>
      ))}
    </div>
  );
}

function Tag({
  product,
  slot,
}: {
  product: Product;
  slot: (typeof SLOTS)[number];
}) {
  const image = getImageUrl(product.image);
  const { min, max } = getPriceRange(product);

  return (
    <div
      className={`absolute w-[200px] sm:w-[220px] ${slot.pos} ${slot.extra}`}
    >
      <Link
        href={`/products/${product._id}`}
        style={{ "--r": slot.r, "--d": slot.d } as React.CSSProperties}
        className="tag-swing group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101536]"
      >
        {/* الخيط */}
        <div className="mx-auto h-10 w-0.5 bg-[#101536]" />

        <div className="relative rounded-3xl bg-white p-3 shadow-[0_18px_40px_-12px_rgba(16,21,54,0.45)] transition-transform duration-300 group-hover:-translate-y-1">
          {/* خرم التعليق */}
          <span className="absolute inset-x-0 -top-2 mx-auto h-4 w-4 rounded-full border-2 border-[#101536] bg-[#FFD93D]" />

          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#f1f2f7]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <FaImage className="text-4xl text-gray-300" />
            )}
          </div>

          <p className="mt-3 line-clamp-1 text-sm font-bold">{product.title}</p>

          <p className="mt-2 inline-block rounded-full bg-[#101536] px-3 py-1 text-base font-black text-[#FFD93D]">
            {min !== max && (
              <span className="me-1 text-[11px] font-semibold text-white/70">
                من
              </span>
            )}
            {formatPrice(min)}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default async function HeroTags() {
  let products: Product[] = [];

  try {
    const result = await getProducts({ sort: "newest", limit: 3 });
    products = result.products;
  } catch {
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <div className={`relative ${HEIGHT}`}>
      {products.slice(0, 3).map((product, i) => (
        <Tag key={product._id} product={product} slot={SLOTS[i]} />
      ))}
    </div>
  );
}
