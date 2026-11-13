import { Suspense } from "react";
import CartContent from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">سلة التسوق</h1>

      <Suspense
        fallback={
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        }
      >
        <CartContent />
      </Suspense>
    </div>
  );
}
