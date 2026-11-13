import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";
import { getProduct } from "@/services/products";
import { getImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import ProductGallery from "./ProductGallery";
import AddToCartButton from "./AddToCartButton";

const MONGO_ID = /^[a-f\d]{24}$/i;

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
        غير متوفر
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
        متبقي {stock.toLocaleString("ar-EG")} فقط
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
      متوفر
    </span>
  );
}

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
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
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
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600">
          المنتجات
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-gray-800">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery
          key={product._id}
          images={images}
          title={product.title}
        />

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {product.category && (
              <Link
                href={`/products?category=${product.category._id}`}
                className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-600 hover:bg-blue-100"
              >
                {product.category.name}
              </Link>
            )}
            {product.brand && (
              <Link
                href={`/products?brand=${product.brand._id}`}
                className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700 hover:bg-gray-200"
              >
                {product.brand.name}
              </Link>
            )}
          </div>

          <h1 className="text-2xl font-bold leading-snug text-gray-900 lg:text-3xl">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-3xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </p>
            <StockBadge stock={product.stock} />
          </div>

          {product.description && (
            <p className="whitespace-pre-line leading-8 text-gray-600">
              {product.description}
            </p>
          )}

          <div className="border-t border-gray-200 pt-5">
            <AddToCartButton productId={product._id} stock={product.stock} />
          </div>
        </div>
      </div>
    </>
  );
}
