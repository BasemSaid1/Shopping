import { Suspense } from "react";
import Link from "next/link";
import HeroTags, { HeroTagsFallback } from "./HeroTags";

const WORDS = ["جاكيت", "موبايل", "سماعة", "ساعة", "شنطة"];

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#FFD93D] text-[#101536]">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-0 lg:pt-0">
        <div className="lg:py-24">
          <h1 className="text-5xl font-black leading-[1.15] sm:text-6xl lg:text-7xl">
            <span className="block">دوّر على</span>

            {/* الكلمة المتغيّرة: ثابتة للقارئ، بتتبدّل بصرياً بس */}
            <span className="my-1 inline-block h-[1.2em] w-[3.4em] overflow-hidden rounded-2xl bg-[#101536] text-center align-bottom text-[#FFD93D] sm:rounded-3xl">
              <span aria-hidden="true" className="word-reel block">
                {[...WORDS, WORDS[0]].map((word, i) => (
                  <span key={i} className="block h-[1.2em]">
                    {word}
                  </span>
                ))}
              </span>
              <span className="sr-only">{WORDS.join("، ")}</span>
            </span>

            <span className="block">وإحنا نوصّلهولك.</span>
          </h1>

          <p className="mt-6 max-w-md text-base font-medium leading-8 text-[#101536]/80 sm:text-lg">
            ملابس وموبايلات وإكسسوارات من ماركات معروفة. ادفع كاش عند الاستلام
            أو بالبطاقة، والطلب بيوصلك لحد الباب.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/products"
              className="rounded-full bg-[#101536] px-8 py-4 text-base font-bold text-white transition hover:bg-[#1d2459] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101536]"
            >
              تسوّق الآن
            </Link>
            <Link
              href="/categories"
              className="text-base font-bold underline decoration-2 underline-offset-8 hover:decoration-[#FF5C47] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#101536]"
            >
              تصفّح الفئات
            </Link>
          </div>
        </div>

        <Suspense fallback={<HeroTagsFallback />}>
          <HeroTags />
        </Suspense>
      </div>
    </section>
  );
}
