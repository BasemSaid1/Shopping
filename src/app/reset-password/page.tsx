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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Suspense
        fallback={
          <div className="h-80 w-full max-w-md animate-pulse rounded-2xl bg-white shadow-lg" />
        }
      >
        <ResetPasswordContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
