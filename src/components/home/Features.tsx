import { FaHeadset, FaLock, FaTags, FaTruck } from "react-icons/fa";
import type { IconType } from "react-icons";

const features: { icon: IconType; title: string; text: string }[] = [
  { icon: FaTruck, title: "توصيل سريع", text: "لحد باب بيتك في أسرع وقت" },
  { icon: FaLock, title: "دفع آمن", text: "بطاقة عبر Stripe أو عند الاستلام" },
  { icon: FaTags, title: "كوبونات خصم", text: "وفّر أكتر بكودات الخصم" },
  { icon: FaHeadset, title: "دعم متواصل", text: "إحنا معاك في أي وقت" },
];

export default function Features() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
              <Icon />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-800">{title}</h3>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
