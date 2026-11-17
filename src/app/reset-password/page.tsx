// import { Suspense } from "react";
// import { redirect } from "next/navigation";
// import ResetPasswordForm from "@/components/ResetPasswordForm";

// type SearchParams = Promise<{ email?: string }>;

// async function ResetPasswordContent({
//   searchParams,
// }: {
//   searchParams: SearchParams;
// }) {
//   const { email } = await searchParams;

//   if (!email) redirect("/forgot-password");

//   return <ResetPasswordForm email={email} />;
// }

// export default function ResetPasswordPage({
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
//         <ResetPasswordContent searchParams={searchParams} />
//       </Suspense>
//     </main>
//   );
// }

import { Suspense } from "react";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/ResetPasswordForm";

type SearchParams = Promise<{ email?: string }>;

async function ResetPasswordContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  if (!email) redirect("/forgot-password");

  return <ResetPasswordForm email={email} />;
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-[#f8f8fa] lg:grid lg:grid-cols-2">
      {/* Left Side */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-10">
          <Suspense
            fallback={
              <div className="space-y-5">
                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
                <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
              </div>
            }
          >
            <ResetPasswordContent searchParams={searchParams} />
          </Suspense>
        </div>
      </section>

      {/* Right Side */}
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src="./images/auth.jfif"
          alt="Shopping store"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
      </section>
    </main>
  );
}
