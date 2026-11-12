import Link from "next/link";
import { FaImage } from "react-icons/fa";
import type { Product } from "@/types";
import { getImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const image = getImageUrl(product.image);
  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">
            <FaImage />
          </div>
        )}
        {outOfStock && (
          <span className="absolute start-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            غير متوفر
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brand && (
          <span className="text-xs text-gray-500">{product.brand.name}</span>
        )}
        <h3 className="line-clamp-2 font-semibold text-gray-800">
          {product.title}
        </h3>
        <p className="mt-auto pt-2 text-lg font-bold text-blue-600">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
