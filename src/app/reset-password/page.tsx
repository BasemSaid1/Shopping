import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  if (!email) redirect("/forgot-password");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <ResetPasswordForm email={email} />
    </main>
  );
}
