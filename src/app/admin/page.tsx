import Link from "next/link";
import {
  FaBoxOpen,
  FaClipboardList,
  FaCopyright,
  FaThLarge,
  FaTicketAlt,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import AdminStats from "@/components/admin/AdminStats";

const sections: {
  href: string;
  title: string;
  text: string;
  icon: IconType;
  color: string;
}[] = [
  {
    href: "/admin/products",
    title: "المنتجات",
    text: "إضافة وتعديل وحذف المنتجات والصور",
    icon: FaBoxOpen,
    color: "bg-blue-600",
  },
  {
    href: "/admin/categories",
    title: "الفئات",
    text: "تنظيم أقسام المتجر",
    icon: FaThLarge,
    color: "bg-indigo-600",
  },
  {
    href: "/admin/brands",
    title: "الماركات",
    text: "إدارة الماركات وفئاتها",
    icon: FaCopyright,
    color: "bg-emerald-600",
  },
  {
    href: "/admin/coupons",
    title: "الكوبونات",
    text: "كودات الخصم وصلاحياتها",
    icon: FaTicketAlt,
    color: "bg-orange-500",
  },
  {
    href: "/admin/orders",
    title: "الطلبات",
    text: "متابعة الطلبات وحالاتها",
    icon: FaClipboardList,
    color: "bg-rose-600",
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
      <p className="mt-1 text-sm text-gray-500">اختر القسم اللي عايز تديره</p>

      <AdminStats />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"></div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map(({ href, title, text, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl text-white ${color}`}
            >
              <Icon />
            </span>
            <div>
              <h2 className="font-bold text-gray-800 group-hover:text-blue-600">
                {title}
              </h2>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
