"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { FaEnvelope, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { zodValidate } from "@/lib/zodValidate";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/validations/auth";
import FormInput from "@/components/FormInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const formik = useFormik<ForgotPasswordValues>({
    initialValues: { email: "" },
    validate: zodValidate(forgotPasswordSchema),
    onSubmit: async (values) => {
      setServerError("");
      const email = values.email.trim().toLowerCase();

      try {
        await api.patch("/auth/forget-password", { email });
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } catch (err) {
        setServerError(getErrorMessage(err));
      }
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        noValidate
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            نسيت كلمة المرور؟
          </h1>
          <p className="text-sm text-gray-600">
            اكتب بريدك الإلكتروني وهنبعتلك كود لإعادة تعيين كلمة المرور
          </p>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <FormInput
          icon={<FaEnvelope />}
          type="email"
          placeholder="البريد الإلكتروني"
          {...formik.getFieldProps("email")}
          error={formik.touched.email && formik.errors.email}
        />

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {formik.isSubmitting && <FaSpinner className="animate-spin" />}
          {formik.isSubmitting ? "جاري الإرسال..." : "إرسال الكود"}
        </button>

        <p className="text-center text-sm text-gray-600">
          <Link href="/login" className="font-semibold text-blue-600">
            الرجوع لتسجيل الدخول
          </Link>
        </p>
      </form>
    </main>
  );
}
