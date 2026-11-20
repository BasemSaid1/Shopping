import Link from "next/link";

const LINES = [
  { label: "التوصيل", value: "لحد باب بيتك" },
  { label: "الدفع", value: "كاش أو بطاقة" },
  { label: "كود الخصم", value: "تكتبه عند الطلب" },
  { label: "الدعم", value: "معاك في أي وقت" },
];

const ZIGZAG =
  "linear-gradient(-45deg, transparent 8px, #fff 0), linear-gradient(45deg, transparent 8px, #fff 0)";

export default function Closing() {
  return (
    <section className="overflow-hidden bg-[#FFD93D] text-[#101536]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className="text-4xl font-black leading-[1.2] sm:text-5xl">
            اطلب النهارده،
            <br />
            واستلم على بابك.
          </h2>
          <p className="mt-5 max-w-md text-base font-medium leading-8 text-[#101536]/80 sm:text-lg">
            اختار منتجاتك، حط كود الخصم لو معاك، وإحنا نكمّل الباقي.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-[#101536] px-8 py-4 text-base font-bold text-white transition hover:bg-[#1d2459] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101536]"
          >
            ابدأ التسوّق
          </Link>
        </div>

        {/* إيصال: بيلخّص طريقة الطلب */}
        <div className="mx-auto w-full max-w-sm -rotate-2">
          <div className="bg-white px-7 pb-6 pt-8 shadow-[0_24px_50px_-18px_rgba(16,21,54,0.5)]">
            <p className="text-center text-xl font-black">طلبك عندنا</p>
            <p className="mt-1 text-center text-xs text-gray-500">
              كل اللي هتحتاجه لحد ما الطلب يوصل
            </p>

            <div className="my-5 border-t-2 border-dashed border-[#101536]/25" />

            <dl className="space-y-4">
              {LINES.map((line) => (
                <div key={line.label} className="flex items-baseline gap-2">
                  <dt className="shrink-0 text-sm font-bold">{line.label}</dt>
                  <span
                    aria-hidden="true"
                    className="min-w-4 flex-1 border-b-2 border-dotted border-[#101536]/25"
                  />
                  <dd className="shrink-0 text-sm text-gray-600">
                    {line.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="my-5 border-t-2 border-dashed border-[#101536]/25" />

            <p className="text-center text-sm font-black">شكراً إنك اخترتنا</p>
          </div>

          {/* الحافة المسنّنة */}
          <div
            aria-hidden="true"
            className="h-4 w-full"
            style={{
              backgroundImage: ZIGZAG,
              backgroundSize: "16px 16px",
              backgroundPosition: "left bottom",
            }}
          />
        </div>
      </div>
    </section>
  );
}
