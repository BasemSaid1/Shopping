"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { FaKey, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { zodValidate } from "@/lib/zodValidate";
import {
  verifyEmailSchema,
  type VerifyEmailValues,
} from "@/lib/validations/auth";
import FormInput from "@/components/FormInput";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [info, setInfo] = useState("");
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const formik = useFormik<VerifyEmailValues>({
    initialValues: { confirmEmailOTP: "" },
    validate: zodValidate(verifyEmailSchema),
    onSubmit: async (values) => {
      setServerError("");
      setInfo("");
      try {
        await api.patch("/auth/verify-email", {
          email,
          confirmEmailOTP: values.confirmEmailOTP.trim(),
        });
        setVerified(true);
        setTimeout(() => router.push("/login"), 1500);
      } catch (err) {
        setServerError(getErrorMessage(err));
      }
    },
  });

  async function handleResend() {
    setServerError("");
    setInfo("");
    setResending(true);
    try {
      await api.patch("/auth/resend-otp", { email });
      setInfo("تم إرسال كود جديد إلى بريدك الإلكتروني");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  }

  if (verified) {
    return (
      <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-8 text-center shadow-lg">
        <FaCheckCircle className="mx-auto text-5xl text-green-500" />
        <h1 className="text-xl font-bold text-gray-800">
          تم تأكيد بريدك بنجاح
        </h1>
        <p className="text-sm text-gray-600">
          جاري تحويلك إلى صفحة تسجيل الدخول...
        </p>
      </div>
    );
  }

  const otpError =
    formik.touched.confirmEmailOTP && formik.errors.confirmEmailOTP;

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          تأكيد البريد الإلكتروني
        </h1>
        <p className="text-sm text-gray-600">أرسلنا كود مكوّن من 6 أرقام إلى</p>
        <p dir="ltr" className="font-semibold text-gray-800">
          {email}
        </p>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}
      {info && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {info}
        </p>
      )}

      <FormInput
        icon={<FaKey />}
        dir="ltr"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        autoComplete="one-time-code"
        {...formik.getFieldProps("confirmEmailOTP")}
        error={otpError}
      />

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {formik.isSubmitting && <FaSpinner className="animate-spin" />}
        {formik.isSubmitting ? "جاري التأكيد..." : "تأكيد"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={cooldown > 0 || resending}
        className="w-full text-sm font-semibold text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        {cooldown > 0
          ? `إعادة إرسال الكود بعد ${cooldown} ثانية`
          : "إعادة إرسال الكود"}
      </button>
    </form>
  );
}
