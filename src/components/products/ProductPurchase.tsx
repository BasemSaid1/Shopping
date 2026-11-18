"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { getPriceRange } from "@/lib/variants";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";

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

export default function ProductPurchase({
  product,
  children,
}: {
  product: Product;
  children?: React.ReactNode;
}) {
  const options = product.options ?? [];
  const variants = product.variants ?? [];
  const hasVariants = options.length > 0 && variants.length > 0;

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (variants.length === 1) {
      for (const a of variants[0].attributes) initial[a.name] = a.value;
    } else {
      for (const o of options) {
        if (o.values.length === 1) initial[o.name] = o.values[0];
      }
    }
    return initial;
  });

  const matches = (v: (typeof variants)[number], sel: Record<string, string>) =>
    v.attributes.every((a) => !sel[a.name] || sel[a.name] === a.value);

  const missing = options.filter((o) => !selected[o.name]);
  const selectedVariant =
    hasVariants && missing.length === 0
      ? variants.find((v) => matches(v, selected))
      : undefined;

  // السعر: للتركيبة المختارة، أو من أقل سعر للتركيبات المطابقة لاختياراتك
  const candidates = variants.filter((v) => matches(v, selected));
  const range = getPriceRange({
    price: product.price,
    variants: candidates.length > 0 ? candidates : variants,
  });
  const price = selectedVariant ? selectedVariant.price : range.min;
  const isRange = !selectedVariant && hasVariants && range.min !== range.max;

  const stock = selectedVariant ? selectedVariant.stock : product.stock;

  // قيمة مش متاحة = مفيش تركيبة فيها مخزون تجمعها مع باقي اختياراتك
  function isAvailable(optionName: string, value: string) {
    return variants.some(
      (v) =>
        v.stock > 0 &&
        v.attributes.some((a) => a.name === optionName && a.value === value) &&
        matches(v, { ...selected, [optionName]: value }),
    );
  }

  function toggle(optionName: string, value: string) {
    setSelected((s) => {
      const next = { ...s };
      if (next[optionName] === value) delete next[optionName];
      else next[optionName] = value;
      return next;
    });
  }

  const blockedReason =
    hasVariants && !selectedVariant
      ? missing.length > 0
        ? `اختر ${missing.map((o) => o.name).join(" و")}`
        : "هذه التركيبة غير متاحة"
      : undefined;

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-3xl font-bold text-blue-600">
          {isRange && (
            <span className="me-2 text-base font-semibold text-gray-500">
              ابتداءً من
            </span>
          )}
          {formatPrice(price)}
        </p>
        <StockBadge stock={stock} />
      </div>

      {children}

      {hasVariants && (
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.name}>
              <p className="mb-2 text-sm font-semibold text-gray-700">
                {option.name}
                {selected[option.name] && (
                  <span className="ms-2 font-normal text-gray-500">
                    {selected[option.name]}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const active = selected[option.name] === value;
                  const available = isAvailable(option.name, value);
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggle(option.name, value)}
                      className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : available
                            ? "border-gray-300 text-gray-700 hover:border-blue-400"
                            : "border-gray-200 text-gray-400 line-through hover:border-gray-300"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-5">
        <AddToCartButton
          key={selectedVariant?._id ?? "none"}
          productId={product._id}
          variantId={selectedVariant?._id}
          stock={stock}
          blockedReason={blockedReason}
        />
      </div>
    </>
  );
}
