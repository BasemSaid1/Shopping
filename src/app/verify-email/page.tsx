import { redirect } from "next/navigation";
import VerifyEmailForm from "@/components/VerifyEmailForm";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email) redirect("/register");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <VerifyEmailForm email={email} />
    </main>
  );
}
