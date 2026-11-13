import CartView from "@/components/cart/CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">سلة التسوق</h1>
      <CartView />
    </div>
  );
}
