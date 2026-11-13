"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios, { type AxiosResponse } from "axios";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
  FaImage,
  FaExclamationTriangle,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/format";
import type { ApiResponse, Cart, CartItem, Product } from "@/types";

type AvailableItem = CartItem & { product: Product };

export default function CartView() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<Cart>>("/cart")
      .then(({ data }) => {
        if (!cancelled) setCart(data.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/cart");
          return;
        }
        setLoadError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router, attempt]);

  function retry() {
    setLoadError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  const items = (cart?.items ?? []).filter(
    (item): item is AvailableItem => item.product !== null,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  async function mutate(
    productId: string,
    request: () => Promise<AxiosResponse<ApiResponse<Cart>>>,
  ) {
    setError("");
    setBusyId(productId);

    try {
      const { data } = await request();
      setCart(data.data);
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/cart");
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const updateQuantity = (productId: string, action: "increase" | "decrease") =>
    mutate(productId, () =>
      api.patch<ApiResponse<Cart>>(`/cart/item/${productId}`, { action }),
    );

  const removeItem = (productId: string) =>
    mutate(productId, () =>
      api.delete<ApiResponse<Cart>>(`/cart/item/${productId}`),
    );

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (loadError || !cart) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-semibold">{loadError || "تعذر تحميل السلة"}</p>
        <button
          type="button"
          onClick={retry}
          className="text-sm font-semibold underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gray-50 py-20 text-center">
        <FaShoppingCart className="text-6xl text-gray-300" />
        <p className="text-lg font-semibold text-gray-700">سلتك فاضية</p>
        <Link
          href="/products"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <ul className="space-y-4">
          {items.map((item) => {
            const { product } = item;
            const image = getImageUrl(product.image);
            const busy = busyId === product._id;

            return (
              <li
                key={product._id}
                className={`flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition ${
                  busy ? "opacity-60" : ""
                }`}
              >
                <Link
                  href={`/products/${product._id}`}
                  className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-3xl text-gray-300 sm:h-28 sm:w-28"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaImage />
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product._id}`}
                        className="line-clamp-2 font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {product.title}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatPrice(item.pricePerUnit)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(product._id)}
                      disabled={busy}
                      aria-label="حذف من السلة"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, "decrease")}
                        disabled={busy || item.quantity <= 1}
                        aria-label="تقليل الكمية"
                        className="p-2.5 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
                      >
                        <FaMinus />
                      </button>
                      <span className="min-w-10 text-center font-semibold">
                        {item.quantity.toLocaleString("ar-EG")}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, "increase")}
                        disabled={busy || item.quantity >= product.stock}
                        aria-label="زيادة الكمية"
                        className="p-2.5 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <p className="font-bold text-blue-600">
                      {formatPrice(item.subTotal)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold text-gray-800">ملخص الطلب</h2>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>عدد القطع</span>
          <span className="font-semibold">
            {totalQuantity.toLocaleString("ar-EG")}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-800">الإجمالي</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(cart.totalPrice)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          إتمام الطلب
        </Link>

        <Link
          href="/products"
          className="block text-center text-sm font-semibold text-blue-600"
        >
          متابعة التسوق
        </Link>
      </aside>
    </div>
  );
}
