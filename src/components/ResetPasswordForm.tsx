// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useFormik } from "formik";
// import { FaKey, FaLock, FaSpinner, FaCheckCircle } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { zodValidate } from "@/lib/zodValidate";
// import {
//   resetPasswordSchema,
//   type ResetPasswordValues,
// } from "@/lib/validations/auth";
// import FormInput from "@/components/FormInput";

// export default function ResetPasswordForm({ email }: { email: string }) {
//   const router = useRouter();
//   const [serverError, setServerError] = useState("");
//   const [done, setDone] = useState(false);

//   const formik = useFormik<ResetPasswordValues>({
//     initialValues: { otp: "", newPassword: "", confirmPassword: "" },
//     validate: zodValidate(resetPasswordSchema),
//     onSubmit: async (values) => {
//       setServerError("");
//       try {
//         await api.patch("/auth/reset-password", {
//           email,
//           otp: values.otp.trim(),
//           newPassword: values.newPassword,
//         });
//         setDone(true);
//         setTimeout(() => router.push("/login"), 1500);
//       } catch (err) {
//         setServerError(getErrorMessage(err));
//       }
//     },
//   });

//   const err = (name: keyof ResetPasswordValues) =>
//     formik.touched[name] && formik.errors[name];

//   if (done) {
//     return (
//       <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-8 text-center shadow-lg">
//         <FaCheckCircle className="mx-auto text-5xl text-green-500" />
//         <h1 className="text-xl font-bold text-gray-800">
//           تم تغيير كلمة المرور بنجاح
//         </h1>
//         <p className="text-sm text-gray-600">
//           جاري تحويلك إلى صفحة تسجيل الدخول...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <form
//       noValidate
//       onSubmit={formik.handleSubmit}
//       className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
//     >
//       <div className="space-y-2 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">
//           إعادة تعيين كلمة المرور
//         </h1>
//         <p className="text-sm text-gray-600">أرسلنا كود مكوّن من 6 أرقام إلى</p>
//         <p dir="ltr" className="font-semibold text-gray-800">
//           {email}
//         </p>
//       </div>

//       {serverError && (
//         <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
//           {serverError}
//         </p>
//       )}

//       <FormInput
//         icon={<FaKey />}
//         dir="ltr"
//         inputMode="numeric"
//         maxLength={6}
//         placeholder="000000"
//         autoComplete="one-time-code"
//         {...formik.getFieldProps("otp")}
//         error={err("otp")}
//       />

//       <FormInput
//         icon={<FaLock />}
//         type="password"
//         placeholder="كلمة المرور الجديدة"
//         {...formik.getFieldProps("newPassword")}
//         error={err("newPassword")}
//       />

//       <FormInput
//         icon={<FaLock />}
//         type="password"
//         placeholder="تأكيد كلمة المرور الجديدة"
//         {...formik.getFieldProps("confirmPassword")}
//         error={err("confirmPassword")}
//       />

//       <button
//         type="submit"
//         disabled={formik.isSubmitting}
//         className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//       >
//         {formik.isSubmitting && <FaSpinner className="animate-spin" />}
//         {formik.isSubmitting ? "جاري الحفظ..." : "تغيير كلمة المرور"}
//       </button>

//       <p className="text-center text-sm text-gray-600">
//         لم يصلك الكود؟{" "}
//         <Link href="/forgot-password" className="font-semibold text-blue-600">
//           اطلب كود جديد
//         </Link>
//       </p>
//     </form>
//   );
// }

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
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <FaCheckCircle className="text-4xl text-green-500" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            تم تغيير كلمة المرور بنجاح
          </h1>

          <p className="text-sm leading-7 text-gray-500">
            تم تحديث كلمة المرور الخاصة بك بنجاح.
            <br />
            جاري تحويلك إلى صفحة تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          إعادة تعيين كلمة المرور
        </h1>

        <p className="text-sm leading-7 text-gray-500">
          أدخل الكود المكوّن من 6 أرقام الذي أرسلناه إلى بريدك الإلكتروني، ثم
          اختر كلمة مرور جديدة.
        </p>

        <div className="inline-flex max-w-full items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <span
            dir="ltr"
            className="break-all text-sm font-semibold text-[#6366f1]"
          >
            {email}
          </span>
        </div>
      </div>

      {/* Form */}
      <form noValidate onSubmit={formik.handleSubmit} className="space-y-6">
        {serverError && (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            كود التحقق
          </label>

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
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            كلمة المرور الجديدة
          </label>

          <FormInput
            icon={<FaLock />}
            type="password"
            placeholder="أدخل كلمة المرور الجديدة"
            {...formik.getFieldProps("newPassword")}
            error={err("newPassword")}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            تأكيد كلمة المرور
          </label>

          <FormInput
            icon={<FaLock />}
            type="password"
            placeholder="أعد إدخال كلمة المرور الجديدة"
            {...formik.getFieldProps("confirmPassword")}
            error={err("confirmPassword")}
          />
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-[#5558e8] hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {formik.isSubmitting && <FaSpinner className="animate-spin" />}

          {formik.isSubmitting ? "جاري الحفظ..." : "تغيير كلمة المرور"}
        </button>

        <p className="text-center text-sm text-gray-500">
          لم يصلك الكود؟{" "}
          <Link
            href="/forgot-password"
            className="font-semibold text-[#6366f1] transition-colors hover:text-[#4f46e5]"
          >
            اطلب كود جديد
          </Link>
        </p>
      </form>
    </div>
  );
}
