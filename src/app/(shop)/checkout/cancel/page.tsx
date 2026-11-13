import Link from "next/link";
import { FaTimesCircle } from "react-icons/fa";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <FaTimesCircle className="text-6xl text-red-500" />
      <h1 className="text-2xl font-bold text-gray-800">لم تتم عملية الدفع</h1>
      <p className="text-gray-600">تم إلغاء الدفع ولم يتم سحب أي مبلغ.</p>
      <Link
        href="/products"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        الرجوع للمتجر
      </Link>
    </div>
  );
}
