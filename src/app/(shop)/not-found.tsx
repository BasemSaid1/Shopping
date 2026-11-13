import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="text-lg font-semibold text-gray-800">
        الصفحة اللي بتدوّر عليها مش موجودة
      </p>
      <Link
        href="/products"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        تصفّح المنتجات
      </Link>
    </div>
  );
}
