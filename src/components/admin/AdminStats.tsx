"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FaBoxOpen,
  FaClipboardList,
  FaExclamationTriangle,
  FaMoneyBillWave,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { AdminStats as Stats, ApiResponse } from "@/types";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: IconType;
  label: string;
  value: string;
  hint?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${color}`}
      >
        <Icon />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="truncate text-xl font-bold text-gray-800">{value}</p>
        {hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

export default function AdminStats() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    api
      .get<ApiResponse<Stats>>("/admin/stats")
      .then(({ data }) => {
        if (!cancelled) setStats(data.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin");
          return;
        }
        setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  // الإحصائيات إضافية: لو فشلت منعرضش خطأ يزعج، والأقسام تحتها شغالة
  if (failed || !stats) return null;

  const pending = (stats.orders.PENDING ?? 0) + (stats.orders.PAID ?? 0);

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={FaMoneyBillWave}
        label="الإيراد"
        value={formatPrice(stats.revenue)}
        hint="طلبات مدفوعة أو مستلمة"
        color="bg-green-50 text-green-600"
      />
      <StatCard
        icon={FaClipboardList}
        label="إجمالي الطلبات"
        value={stats.totalOrders.toLocaleString("ar-EG")}
        hint={`${(stats.orders.DELIVERED ?? 0).toLocaleString("ar-EG")} تم تسليمه`}
        color="bg-blue-50 text-blue-600"
      />
      <StatCard
        icon={FaExclamationTriangle}
        label="طلبات محتاجة متابعة"
        value={pending.toLocaleString("ar-EG")}
        hint="قيد الانتظار أو مدفوعة"
        color="bg-yellow-50 text-yellow-600"
      />
      <StatCard
        icon={FaBoxOpen}
        label="مخزون قليل"
        value={stats.lowStock.toLocaleString("ar-EG")}
        hint={`${stats.outOfStock.toLocaleString("ar-EG")} منتج نفد`}
        color="bg-red-50 text-red-600"
      />
    </div>
  );
}
