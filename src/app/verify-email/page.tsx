// import { Suspense } from "react";
// import { redirect } from "next/navigation";
// import VerifyEmailForm from "@/components/VerifyEmailForm";

// type SearchParams = Promise<{ email?: string }>;

// async function VerifyEmailContent({
//   searchParams,
// }: {
//   searchParams: SearchParams;
// }) {
//   const { email } = await searchParams;

//   if (!email) redirect("/register");

//   return <VerifyEmailForm email={email} />;
// }

// export default function VerifyEmailPage({
//   searchParams,
// }: {
//   searchParams: SearchParams;
// }) {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
//       <Suspense
//         fallback={
//           <div className="h-80 w-full max-w-md animate-pulse rounded-2xl bg-white shadow-lg" />
//         }
//       >
//         <VerifyEmailContent searchParams={searchParams} />
//       </Suspense>
//     </main>
//   );
// }

import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import VerifyEmailForm from "@/components/VerifyEmailForm";

type SearchParams = Promise<{ email?: string }>;

async function VerifyEmailContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  if (!email) redirect("/register");

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold tracking-wide text-[#6366f1]">
          EMAIL VERIFICATION
        </p>

        <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          تأكيد البريد الإلكتروني
        </h1>

        <p className="text-sm leading-7 text-gray-500">
          أرسلنا لك رمز التحقق على بريدك الإلكتروني. أدخل الرمز لتأكيد حسابك
          وإكمال عملية التسجيل.
        </p>
      </div>

      <VerifyEmailForm email={email} />
    </div>
  );
}

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-[#f8f8fa] lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          <Suspense
            fallback={
              <div className="space-y-5">
                <div className="h-3 w-36 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
                <div className="h-20 w-full animate-pulse rounded-xl bg-gray-200" />
                <div className="h-14 w-full animate-pulse rounded-xl bg-gray-200" />
              </div>
            }
          >
            <VerifyEmailContent searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      {/* Right Image */}
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src="./images/auth2.jfif"
          alt="Shopping store"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
      </section>
    </main>
  );
}
