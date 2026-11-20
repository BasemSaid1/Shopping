"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getImageUrl } from "@/lib/image";
import type { AdminUser, AdminUsersResult, ApiResponse } from "@/types";
import { ListEmpty, ListError } from "@/components/ListStates";
import ConfirmDialog from "../ConfirmDialog";

const PAGE_SIZE = 10;

type Filter = "all" | "verified" | "unverified" | "admins";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "verified", label: "مفعّل" },
  { value: "unverified", label: "غير مفعّل" },
  { value: "admins", label: "الأدمن" },
];

function filterParams(filter: Filter) {
  if (filter === "verified") return { verified: "true" };
  if (filter === "unverified") return { verified: "false" };
  if (filter === "admins") return { role: "ADMIN" };
  return {};
}

function Avatar({ user }: { user: AdminUser }) {
  const src = getImageUrl(user.profilePic);

  return src ? (
    <img
      src={src}
      alt=""
      className="h-11 w-11 shrink-0 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-base font-bold text-indigo-600">
      {user.firstName.charAt(0)}
    </span>
  );
}

export default function AdminUsersView() {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<AdminUsersResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // البحث بيتنفّذ بعد ما المستخدم يوقف كتابة لحظة
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) return;

    const timer = setTimeout(() => {
      setLoading(true);
      setSearch(trimmed);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, search]);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<AdminUsersResult>>("/admin/users", {
        params: {
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
          ...filterParams(filter),
        },
      })
      .then(({ data: res }) => {
        if (cancelled) return;
        setData(res.data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/users");
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
  }, [page, filter, search, attempt, router]);

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  }

  function changeFilter(next: Filter) {
    if (next === filter) return;
    setLoading(true);
    setFilter(next);
    setPage(1);
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
      await api.delete(`/admin/users/${deleting._id}`);

      // لو ده كان آخر مستخدم في الصفحة نرجع صفحة
      if (users.length === 1 && page > 1) setPage(page - 1);

      setDeleting(null);
      setLoading(true);
      setAttempt((a) => a + 1);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push("/login?redirect=/admin/users");
        return;
      }

      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
    }
  }

  const users = data?.users ?? [];
  const summary = data?.summary;
  const pagination = data?.pagination;

  const tiles = [
    { label: "كل المستخدمين", value: summary?.total },
    { label: "مفعّلين", value: summary?.verified },
    { label: "غير مفعّلين", value: summary?.unverified },
    { label: "أدمن", value: summary?.admins },
  ];

  return (
    <>
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
          <FaUsers />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">المستخدمين</h1>
          <p className="mt-1 text-sm text-gray-500">
            الحسابات المسجّلة في المتجر
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500">{tile.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {tile.value === undefined
                ? "–"
                : tile.value.toLocaleString("ar-EG")}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-5 space-y-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ابحث بالاسم أو البريد الإلكتروني"
            maxLength={50}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-11 text-sm outline-none focus:border-indigo-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => changeFilter(f.value)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filter === f.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      ) : error ? (
        <ListError message={error} onRetry={retry} />
      ) : users.length === 0 ? (
        <ListEmpty
          text={
            search || filter !== "all"
              ? "مفيش مستخدمين مطابقين للبحث"
              : "مفيش مستخدمين لسه"
          }
        />
      ) : (
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u._id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar user={u} />

                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">
                    {u.firstName} {u.lastName}
                  </p>
                  <p
                    dir="ltr"
                    className="truncate text-right text-sm text-gray-500"
                  >
                    {u.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span
                  className={`rounded-full px-3 py-1 ${
                    u.role === "ADMIN"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.role === "ADMIN" ? "أدمن" : "عميل"}
                </span>

                <span
                  className={`rounded-full px-3 py-1 ${
                    u.confirmEmail
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {u.confirmEmail ? "مفعّل" : "غير مفعّل"}
                </span>

                {u.provider === "GOOGLE" && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                    جوجل
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 sm:w-44 sm:text-center">
                انضم في {formatDate(u.createdAt)}
              </p>

              {u.role !== "ADMIN" && (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError("");
                    setDeleting(u);
                  }}
                  aria-label={`حذف ${u.firstName} ${u.lastName}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50 sm:self-auto"
                >
                  <FaTrash />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && !loading && !error && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            <FaChevronRight className="text-xs" />
            السابق
          </button>

          <span className="text-sm font-semibold text-gray-600">
            {pagination.page.toLocaleString("ar-EG")} من{" "}
            {pagination.totalPages.toLocaleString("ar-EG")}
          </span>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={!pagination.hasNextPage}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
          >
            التالي
            <FaChevronLeft className="text-xs" />
          </button>
        </div>
      )}

      {deleting && (
        <ConfirmDialog
          title="حذف المستخدم"
          message={`هيتم حذف حساب ${deleting.firstName} ${deleting.lastName} (${deleting.email}) نهائياً مع سلته وتقييماته. لا يمكن التراجع. الحساب اللي له طلبات ما بيتحذفش.`}
          confirmLabel="حذف الحساب"
          busy={deleteBusy}
          error={deleteError}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}
