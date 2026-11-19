import CheckoutSkeleton from "@/components/checkout/CheckoutSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">إتمام الطلب</h1>
      <CheckoutSkeleton />
    </div>
  );
}
