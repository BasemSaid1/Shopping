import { Suspense } from "react";
import { redirect } from "next/navigation";
import VerifyEmailForm from "@/components/VerifyEmailForm";

type SearchParams = Promise<{ email?: string }>;

async function VerifyEmailContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;

  if (!email) redirect("/register");

  return <VerifyEmailForm email={email} />;
}

export default function VerifyEmailPage({
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
        <VerifyEmailContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
