// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useFormik } from "formik";
// import { FaKey, FaSpinner, FaCheckCircle } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { zodValidate } from "@/lib/zodValidate";
// import {
//   verifyEmailSchema,
//   type VerifyEmailValues,
// } from "@/lib/validations/auth";
// import FormInput from "@/components/FormInput";

// const RESEND_COOLDOWN = 60;

// export default function VerifyEmailForm({ email }: { email: string }) {
//   const router = useRouter();
//   const [serverError, setServerError] = useState("");
//   const [info, setInfo] = useState("");
//   const [verified, setVerified] = useState(false);
//   const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
//   const [resending, setResending] = useState(false);

//   useEffect(() => {
//     if (cooldown <= 0) return;
//     const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [cooldown]);

//   const formik = useFormik<VerifyEmailValues>({
//     initialValues: { confirmEmailOTP: "" },
//     validate: zodValidate(verifyEmailSchema),
//     onSubmit: async (values) => {
//       setServerError("");
//       setInfo("");
//       try {
//         await api.patch("/auth/verify-email", {
//           email,
//           confirmEmailOTP: values.confirmEmailOTP.trim(),
//         });
//         setVerified(true);
//         setTimeout(() => router.push("/login"), 1500);
//       } catch (err) {
//         setServerError(getErrorMessage(err));
//       }
//     },
//   });

//   async function handleResend() {
//     setServerError("");
//     setInfo("");
//     setResending(true);
//     try {
//       await api.patch("/auth/resend-otp", { email });
//       setInfo("تم إرسال كود جديد إلى بريدك الإلكتروني");
//       setCooldown(RESEND_COOLDOWN);
//     } catch (err) {
//       setServerError(getErrorMessage(err));
//     } finally {
//       setResending(false);
//     }
//   }

//   if (verified) {
//     return (
//       <div className="w-full max-w-md space-y-3 rounded-2xl bg-white p-8 text-center shadow-lg">
//         <FaCheckCircle className="mx-auto text-5xl text-green-500" />
//         <h1 className="text-xl font-bold text-gray-800">
//           تم تأكيد بريدك بنجاح
//         </h1>
//         <p className="text-sm text-gray-600">
//           جاري تحويلك إلى صفحة تسجيل الدخول...
//         </p>
//       </div>
//     );
//   }

//   const otpError =
//     formik.touched.confirmEmailOTP && formik.errors.confirmEmailOTP;

//   return (
//     <form
//       noValidate
//       onSubmit={formik.handleSubmit}
//       className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
//     >
//       <div className="space-y-2 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">
//           تأكيد البريد الإلكتروني
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
//       {info && (
//         <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
//           {info}
//         </p>
//       )}

//       <FormInput
//         icon={<FaKey />}
//         dir="ltr"
//         inputMode="numeric"
//         maxLength={6}
//         placeholder="000000"
//         autoComplete="one-time-code"
//         {...formik.getFieldProps("confirmEmailOTP")}
//         error={otpError}
//       />

//       <button
//         type="submit"
//         disabled={formik.isSubmitting}
//         className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//       >
//         {formik.isSubmitting && <FaSpinner className="animate-spin" />}
//         {formik.isSubmitting ? "جاري التأكيد..." : "تأكيد"}
//       </button>

//       <button
//         type="button"
//         onClick={handleResend}
//         disabled={cooldown > 0 || resending}
//         className="w-full text-sm font-semibold text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
//       >
//         {cooldown > 0
//           ? `إعادة إرسال الكود بعد ${cooldown} ثانية`
//           : "إعادة إرسال الكود"}
//       </button>
//     </form>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { FaKey, FaSpinner, FaCheckCircle, FaEnvelope } from "react-icons/fa";
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
      <div className="w-full space-y-6 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-gray-900">
            تم تأكيد بريدك بنجاح!
          </h2>

          <p className="text-sm leading-7 text-gray-500">
            حسابك أصبح جاهزاً الآن. جاري تحويلك إلى صفحة تسجيل الدخول...
          </p>
        </div>

        <div className="mx-auto h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-full origin-left animate-pulse rounded-full bg-[#6366f1]" />
        </div>
      </div>
    );
  }

  const otpError =
    formik.touched.confirmEmailOTP && formik.errors.confirmEmailOTP;

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      className="w-full space-y-6"
    >
      {/* Email Information */}
      <div className="mb-2 rounded-2xl border border-[#6366f1]/10 bg-[#6366f1]/5 p-5">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#6366f1] shadow-sm">
          <FaEnvelope className="text-lg" />
        </div>

        <p className="mb-2 text-sm text-gray-500">
          أرسلنا كود تحقق مكوّن من 6 أرقام إلى:
        </p>

        <p dir="ltr" className="break-all text-sm font-bold text-gray-900">
          {email}
        </p>
      </div>

      {/* Server Error */}
      {serverError && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}

      {/* Success Message */}
      {info && (
        <p className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          {info}
        </p>
      )}

      {/* OTP Input */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          كود التحقق
        </label>

        <div className="[&_input]:text-center [&_input]:text-xl [&_input]:font-bold [&_input]:tracking-[0.5em]">
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
        </div>

        <p className="mt-2 text-xs text-gray-400">
          أدخل الكود المرسل إلى بريدك الإلكتروني.
        </p>
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] py-4 font-bold text-white shadow-lg shadow-[#6366f1]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#4f46e5] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formik.isSubmitting && <FaSpinner className="animate-spin" />}

        {formik.isSubmitting ? "جاري التأكيد..." : "تأكيد البريد الإلكتروني"}
      </button>

      {/* Resend OTP */}
      <div className="space-y-3 text-center">
        <p className="text-sm text-gray-500">موصلكش الكود؟</p>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#6366f1] transition hover:text-[#4f46e5] disabled:cursor-not-allowed disabled:text-gray-400"
        >
          {resending && <FaSpinner className="animate-spin" />}

          {cooldown > 0
            ? `إعادة إرسال الكود بعد ${cooldown} ثانية`
            : resending
              ? "جاري إرسال الكود..."
              : "إعادة إرسال الكود"}
        </button>
      </div>
    </form>
  );
}
