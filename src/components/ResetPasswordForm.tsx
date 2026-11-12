"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { FaKey, FaLock, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { zodValidate } from "@/lib/zodValidate";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validations/auth";
import FormInput from "@/components/FormInput";

export default function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const formik = useFormik<ResetPasswordValues>({
    initialValues: { otp: "", newPassword: "", confirmPassword: "" },
    validate: zodValidate(resetPasswordSchema),
    onSubmit: async (values) => {
      setServerError("");
      try {
        await api.patch("/auth/reset-password", {
          email,
          otp: values.otp.trim(),
          newPassword: values.newPassword,
        });
        setDone(true);
        setTimeout(() => router.push("/login"), 1500);
      } catch (err) {
        setServerError(getErrorMessage(err));
      }
    },
  });

  const err = (name: keyof ResetPasswordValues) =>
    formik.touched[name] && formik.errors[name];

  if (done) {
    return (
      <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-8 text-center shadow-lg">
        <FaCheckCircle className="mx-auto text-5xl text-green-500" />
        <h1 className="text-xl font-bold text-gray-800">
          تم تغيير كلمة المرور بنجاح
        </h1>
        <p className="text-sm text-gray-600">
          جاري تحويلك إلى صفحة تسجيل الدخول...
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          إعادة تعيين كلمة المرور
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

      <FormInput
        icon={<FaKey />}
        dir="ltr"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        autoComplete="one-time-code"
        {...formik.getFieldProps("otp")}
        error={err("otp")}
      />

      <FormInput
        icon={<FaLock />}
        type="password"
        placeholder="كلمة المرور الجديدة"
        {...formik.getFieldProps("newPassword")}
        error={err("newPassword")}
      />

      <FormInput
        icon={<FaLock />}
        type="password"
        placeholder="تأكيد كلمة المرور الجديدة"
        {...formik.getFieldProps("confirmPassword")}
        error={err("confirmPassword")}
      />

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {formik.isSubmitting && <FaSpinner className="animate-spin" />}
        {formik.isSubmitting ? "جاري الحفظ..." : "تغيير كلمة المرور"}
      </button>

      <p className="text-center text-sm text-gray-600">
        لم يصلك الكود؟{" "}
        <Link href="/forgot-password" className="font-semibold text-blue-600">
          اطلب كود جديد
        </Link>
      </p>
    </form>
  );
}
