// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import axios from "axios";
// import {
//   FaMinus,
//   FaPlus,
//   FaShoppingCart,
//   FaSpinner,
//   FaCheckCircle,
// } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";

// export default function AddToCartButton({
//   productId,
//   variantId,
//   stock,
//   blockedReason,
// }: {
//   productId: string;
//   variantId?: string;
//   stock: number;
//   // لو المنتج له خيارات ولسه ما اتحددتش: بنعرض الرسالة دي بدل الزرار
//   blockedReason?: string;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [added, setAdded] = useState(false);

//   async function handleAdd() {
//     setError("");
//     setAdded(false);
//     setLoading(true);

//     try {
//       await api.post("/cart/add", { productId, variantId, quantity });
//       setAdded(true);
//       router.refresh();
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
//         return;
//       }
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (blockedReason) {
//     return (
//       <button
//         disabled
//         className="w-full cursor-not-allowed rounded-lg bg-gray-200 py-3 font-semibold text-gray-500"
//       >
//         {blockedReason}
//       </button>
//     );
//   }

//   if (stock === 0) {
//     return (
//       <button
//         disabled
//         className="w-full cursor-not-allowed rounded-lg bg-gray-200 py-3 font-semibold text-gray-500"
//       >
//         غير متوفر حاليًا
//       </button>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       <div className="flex flex-wrap items-center gap-3">
//         <div className="flex items-center rounded-lg border border-gray-300">
//           <button
//             type="button"
//             onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//             disabled={quantity <= 1}
//             aria-label="تقليل الكمية"
//             className="p-3 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
//           >
//             <FaMinus />
//           </button>
//           <span className="min-w-10 text-center font-semibold">
//             {quantity.toLocaleString("ar-EG")}
//           </span>
//           <button
//             type="button"
//             onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
//             disabled={quantity >= stock}
//             aria-label="زيادة الكمية"
//             className="p-3 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
//           >
//             <FaPlus />
//           </button>
//         </div>

//         <button
//           type="button"
//           onClick={handleAdd}
//           disabled={loading}
//           className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//         >
//           {loading ? (
//             <FaSpinner className="animate-spin" />
//           ) : (
//             <FaShoppingCart />
//           )}
//           {loading ? "جاري الإضافة..." : "أضف إلى السلة"}
//         </button>
//       </div>

//       {added && (
//         <p className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
//           <FaCheckCircle />
//           تمت الإضافة إلى السلة.
//           <Link href="/cart" className="font-semibold underline">
//             عرض السلة
//           </Link>
//         </p>
//       )}

//       {error && (
//         <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function AddToCartButton({
  productId,
  variantId,
  stock,
  blockedReason,
}: {
  productId: string;
  variantId?: string;
  stock: number;
  blockedReason?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    setError("");
    setAdded(false);
    setLoading(true);

    try {
      await api.post("/cart/add", { productId, variantId, quantity });
      setAdded(true);
      router.refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (blockedReason) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-gray-100 py-4 font-bold text-gray-400"
      >
        {blockedReason}
      </button>
    );
  }

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-gray-100 py-4 font-bold text-gray-400"
      >
        غير متوفر حاليًا
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-14 items-center rounded-xl border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="تقليل الكمية"
            className="px-4 text-gray-500 transition hover:text-[#6366f1] disabled:text-gray-200"
          >
            <FaMinus />
          </button>

          <span className="min-w-10 text-center font-extrabold text-gray-900">
            {quantity.toLocaleString("ar-EG")}
          </span>

          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            aria-label="زيادة الكمية"
            className="px-4 text-gray-500 transition hover:text-[#6366f1] disabled:text-gray-200"
          >
            <FaPlus />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={loading}
          className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-[#6366f1] px-5 font-bold text-white shadow-lg shadow-indigo-100 transition duration-200 hover:-translate-y-0.5 hover:bg-[#5558e8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaShoppingCart />
          )}

          {loading ? "جاري الإضافة..." : "أضف إلى السلة"}
        </button>
      </div>

      {added && (
        <p className="flex flex-wrap items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <FaCheckCircle />
          تمت الإضافة إلى السلة.
          <Link href="/cart" className="underline">
            عرض السلة
          </Link>
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
