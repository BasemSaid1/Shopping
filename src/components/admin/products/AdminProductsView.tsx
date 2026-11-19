"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaImage,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { useList } from "@/lib/useList";
import type {
  ApiResponse,
  Brand,
  Category,
  Product,
  ProductsResult,
} from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";
import ProductFormModal from "./ProductFormModal";
import { getPriceRange } from "@/lib/variants";

const PAGE_SIZE = 10;

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
        نفد
      </span>
    );
  }
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        stock <= 5
          ? "bg-yellow-50 text-yellow-700"
          : "bg-green-50 text-green-700"
      }`}
    >
      المخزون: {stock.toLocaleString("ar-EG")}
    </span>
  );
}

export default function AdminProductsView() {
  const router = useRouter();
  const { items: categories } = useList<Category>(
    "/categories",
    "/admin/products",
  );
  const { items: brands } = useList<Brand>("/brands", "/admin/products");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<ProductsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formFor, setFormFor] = useState<Product | "new" | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // البحث بعد ما المستخدم يبطّل كتابة
  useEffect(() => {
    const t = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== search) {
        setLoading(true);
        setSearch(next);
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, search]);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<ProductsResult>>("/admin/products", {
        params: { page, limit: PAGE_SIZE, search: search || undefined },
      })
      .then(({ data: res }) => {
        if (cancelled) return;
        setData(res.data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/products");
          return;
        }
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, attempt, router]);

  function refresh() {
    setAttempt((a) => a + 1);
  }

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  function goTo(next: number) {
    setLoading(true);
    setPage(next);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await api.delete(`/admin/products/${deleting._id}`);
      setDeleting(null);
      // لو ده كان آخر منتج في الصفحة، نرجع صفحة
      if (data && data.products.length === 1 && page > 1) {
        goTo(page - 1);
      } else {
        refresh();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/products");
        return;
      }
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
          <p className="text-sm text-gray-500">
            {(pagination?.total ?? 0).toLocaleString("ar-EG")} منتج
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FaPlus /> إضافة منتج
        </button>
      </div>

      <div className="relative mb-5">
        <FaSearch className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="ابحث باسم المنتج..."
          autoComplete="off"
          className="w-full rounded-xl border border-gray-300 bg-white py-2.5 ps-10 pe-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : products.length === 0 ? (
        <ListEmpty
          text={
            search
              ? "مفيش نتايج للبحث ده"
              : "مفيش منتجات لسه، ابدأ بإضافة أول منتج"
          }
        />
      ) : (
        <ul className="space-y-3">
          {products.map((p) => {
            const image = getImageUrl(p.image);
            return (
              <li
                key={p._id}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                  {image ? (
                    <img
                      src={image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaImage className="text-2xl text-gray-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-800">{p.title}</p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {[p.category?.name, p.brand?.name]
                      .filter(Boolean)
                      .join(" • ") || "بدون فئة"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-blue-600">
                      {getPriceRange(p).min !== getPriceRange(p).max && (
                        <span className="me-1 text-xs font-semibold text-gray-500">
                          ابتداءً من
                        </span>
                      )}
                      {formatPrice(getPriceRange(p).min)}
                    </span>
                    {(p.variants?.length ?? 0) > 0 && (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {p.variants!.length.toLocaleString("ar-EG")} تركيبة
                      </span>
                    )}
                    <StockBadge stock={p.stock} />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormFor(p)}
                    aria-label={`تعديل ${p.title}`}
                    className="rounded-lg p-2.5 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError("");
                      setDeleting(p);
                    }}
                    aria-label={`حذف ${p.title}`}
                    className="rounded-lg p-2.5 text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && !loading && !error && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            <FaChevronRight className="text-xs" /> السابق
          </button>
          <span className="text-sm text-gray-600">
            {pagination.page.toLocaleString("ar-EG")} من{" "}
            {pagination.totalPages.toLocaleString("ar-EG")}
          </span>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={!pagination.hasNextPage}
            className="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-40"
          >
            التالي <FaChevronLeft className="text-xs" />
          </button>
        </div>
      )}

      {formFor && (
        <ProductFormModal
          product={formFor === "new" ? null : formFor}
          categories={categories}
          brands={brands}
          onClose={() => setFormFor(null)}
          onSaved={() => {
            setFormFor(null);
            refresh();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف المنتج"
          message={`هل تريد حذف "${deleting.title}"؟ هتتمسح صوره كمان ولا يمكن التراجع.`}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
