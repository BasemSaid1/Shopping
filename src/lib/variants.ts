import type { Product, ProductVariant } from "@/types";

export function getPriceRange(product: Pick<Product, "price" | "variants">) {
  const prices = (product.variants ?? []).map((v) => v.price);
  if (prices.length === 0) return { min: product.price, max: product.price };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function findVariant(
  product: Pick<Product, "variants">,
  variantId?: string,
): ProductVariant | undefined {
  if (!variantId) return undefined;
  return (product.variants ?? []).find((v) => v._id === variantId);
}

// المخزون المتاح لصنف في السلة. null لو الخيار لم يعد متاحًا
export function getItemStock(item: {
  product: Product;
  variantId?: string;
}): number | null {
  const hasVariants = (item.product.variants?.length ?? 0) > 0;
  if (!hasVariants) return item.variantId ? null : item.product.stock;
  return findVariant(item.product, item.variantId)?.stock ?? null;
}

// نفس المنتج بمتغيّرين مختلفين = صنفين مختلفين في السلة
export function cartItemKey(item: {
  product: { _id: string };
  variantId?: string;
}) {
  return `${item.product._id}:${item.variantId ?? ""}`;
}
