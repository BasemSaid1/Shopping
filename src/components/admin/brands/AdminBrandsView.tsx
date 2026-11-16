"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEdit, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import { useList } from "@/lib/useList";
import type { Brand, Category } from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";
import BrandFormModal from "./BrandFormModal";

export default function AdminBrandsView() {
  const router = useRouter();
  const { items, loading, error, retry, refresh } = useList<Brand>(
    "/brands",
    "/admin/brands",
  );
  const { items: categories } = useList<Category>(
    "/categories",
    "/admin/brands",
  );

  const [formFor, setFormFor] = useState<Brand | "new" | null>(null);
  const [deleting, setDeleting] = useState<Brand | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    setDeleteError("");
    try {
      await api.delete(`/admin/brands/${deleting._id}`);
      setDeleting(null);
      refresh();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/brands");
        return;
      }
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الماركات</h1>
          <p className="text-sm text-gray-500">
            {items.length.toLocaleString("ar-EG")} ماركة
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormFor("new")}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FaPlus /> إضافة ماركة
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : items.length === 0 ? (
        <ListEmpty text="مفيش ماركات لسه، ابدأ بإضافة أول ماركة" />
      ) : (
        <ul className="space-y-3">
          {items.map((b) => {
            const logo = getImageUrl(b.logo);
            return (
              <li
                key={b._id}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-3"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                  {logo ? (
                    <img
                      src={logo}
                      alt={b.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <FaImage className="text-2xl text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-800">{b.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {b.categories.map((c) => (
                      <span
                        key={c._id}
                        className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormFor(b)}
                    aria-label={`تعديل ${b.name}`}
                    className="rounded-lg p-2.5 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError("");
                      setDeleting(b);
                    }}
                    aria-label={`حذف ${b.name}`}
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

      {formFor && (
        <BrandFormModal
          brand={formFor === "new" ? null : formFor}
          categories={categories}
          onClose={() => setFormFor(null)}
          onSaved={() => {
            setFormFor(null);
            refresh();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف الماركة"
          message={`هل تريد حذف ماركة "${deleting.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
