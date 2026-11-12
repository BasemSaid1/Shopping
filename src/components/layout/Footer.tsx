import Link from "next/link";
import {
  FaStore,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const shopLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/categories", label: "الفئات" },
  { href: "/brands", label: "الماركات" },
];

const accountLinks = [
  { href: "/login", label: "تسجيل الدخول" },
  { href: "/register", label: "إنشاء حساب" },
  { href: "/cart", label: "السلة" },
  { href: "/orders", label: "طلباتي" },
];

const socials = [
  { href: "#", label: "فيسبوك", icon: <FaFacebookF /> },
  { href: "#", label: "إنستجرام", icon: <FaInstagram /> },
  { href: "#", label: "واتساب", icon: <FaWhatsapp /> },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <FaStore className="text-blue-500" />
            متجري
          </Link>
          <p className="text-sm leading-7 text-gray-400">
            وجهتك لأفضل المنتجات بأسعار مناسبة وتجربة شراء سهلة وآمنة.
          </p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 transition hover:bg-blue-600 hover:text-white"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">روابط سريعة</h3>
          <ul className="space-y-2 text-sm">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">حسابي</h3>
          <ul className="space-y-2 text-sm">
            {accountLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">تواصل معنا</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaPhone className="text-blue-500" />
              <span dir="ltr">+20 100 000 0000</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-blue-500" />
              support@example.com
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-500" />
              القاهرة، مصر
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} متجري. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
