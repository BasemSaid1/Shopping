import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { getCart } from "@/services/cart";
import type { Cart } from "@/types";
import CartView from "./CartView";

export default async function CartContent() {
  let cart: Cart | null = null;

  try {
    cart = await getCart();
  } catch {
    cart = null;
  }

  if (!cart) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-red-50 py-16 text-red-600">
        <FaExclamationTriangle className="text-4xl" />
        <p className="font-semibold">تعذر تحميل السلة</p>
        <Link
          href="/login?redirect=/cart"
          className="text-sm font-semibold underline"
        >
          سجّل الدخول من جديد
        </Link>
      </div>
    );
  }

  return <CartView initialCart={cart} />;
}
