import Link from "next/link";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

interface PaginationProps {
  page: number;
  totalPages: number;
  baseParams: Record<string, string>;
}

export default function Pagination({
  page,
  totalPages,
  baseParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(baseParams);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition";

  return (
    <nav
      aria-label="التنقل بين الصفحات"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          aria-label="السابق"
          className={`${base} border-gray-300 text-gray-700 hover:bg-gray-100`}
        >
          <FaChevronRight />
        </Link>
      ) : (
        <span className={`${base} border-gray-200 text-gray-300`}>
          <FaChevronRight />
        </span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${base} ${
            p === page
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {p.toLocaleString("ar-EG")}
        </Link>
      ))}

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          aria-label="التالي"
          className={`${base} border-gray-300 text-gray-700 hover:bg-gray-100`}
        >
          <FaChevronLeft />
        </Link>
      ) : (
        <span className={`${base} border-gray-200 text-gray-300`}>
          <FaChevronLeft />
        </span>
      )}
    </nav>
  );
}
