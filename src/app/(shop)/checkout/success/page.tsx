import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <FaCheckCircle className="text-6xl text-green-500" />
      <h1 className="text-2xl font-bold text-gray-800">تم استلام طلبك</h1>
      <p className="text-gray-600">شكرًا لتسوقك معنا.</p>
      <Link
        href="/products"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        متابعة التسوق
      </Link>
    </div>
  );
}
