import OrdersView from "@/components/orders/OrdersView";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">طلباتي</h1>
      <OrdersView />
    </div>
  );
}
