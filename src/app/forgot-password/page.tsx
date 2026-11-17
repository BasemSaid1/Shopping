// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useFormik } from "formik";
// import { FaEnvelope, FaSpinner } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { zodValidate } from "@/lib/zodValidate";
// import {
//   forgotPasswordSchema,
//   type ForgotPasswordValues,
// } from "@/lib/validations/auth";
// import FormInput from "@/components/FormInput";

// export default function ForgotPasswordPage() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState("");

//   const formik = useFormik<ForgotPasswordValues>({
//     initialValues: { email: "" },
//     validate: zodValidate(forgotPasswordSchema),
//     onSubmit: async (values) => {
//       setServerError("");
//       const email = values.email.trim().toLowerCase();

//       try {
//         await api.patch("/auth/forget-password", { email });
//         router.push(`/reset-password?email=${encodeURIComponent(email)}`);
//       } catch (err) {
//         setServerError(getErrorMessage(err));
//       }
//     },
//   });

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
//       <form
//         noValidate
//         onSubmit={formik.handleSubmit}
//         className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
//       >
//         <div className="space-y-2 text-center">
//           <h1 className="text-2xl font-bold text-gray-800">
//             نسيت كلمة المرور؟
//           </h1>
//           <p className="text-sm text-gray-600">
//             اكتب بريدك الإلكتروني وهنبعتلك كود لإعادة تعيين كلمة المرور
//           </p>
//         </div>

//         {serverError && (
//           <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
//             {serverError}
//           </p>
//         )}

//         <FormInput
//           icon={<FaEnvelope />}
//           type="email"
//           placeholder="البريد الإلكتروني"
//           {...formik.getFieldProps("email")}
//           error={formik.touched.email && formik.errors.email}
//         />

//         <button
//           type="submit"
//           disabled={formik.isSubmitting}
//           className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//         >
//           {formik.isSubmitting && <FaSpinner className="animate-spin" />}
//           {formik.isSubmitting ? "جاري الإرسال..." : "إرسال الكود"}
//         </button>

//         <p className="text-center text-sm text-gray-600">
//           <Link href="/login" className="font-semibold text-blue-600">
//             الرجوع لتسجيل الدخول
//           </Link>
//         </p>
//       </form>
//     </main>
//   );
// }

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
    <main className="min-h-screen bg-[#f8f8fa] lg:grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md space-y-10">
          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              نسيت كلمة المرور؟
            </h1>

            <p className="text-sm leading-7 text-gray-500">
              متقلقش، الموضوع بسيط. اكتب بريدك الإلكتروني وهنبعتلك كود لإعادة
              تعيين كلمة المرور.
            </p>
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
                البريد الإلكتروني
              </label>

              <FormInput
                icon={<FaEnvelope />}
                type="email"
                placeholder="ادخل بريدك الإلكتروني"
                {...formik.getFieldProps("email")}
                error={formik.touched.email && formik.errors.email}
              />
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:bg-[#5558e8] hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting && <FaSpinner className="animate-spin" />}

              {formik.isSubmitting ? "جاري الإرسال..." : "إرسال الكود"}
            </button>

            <p className="text-center text-sm text-gray-500">
              افتكرت كلمة المرور؟{" "}
              <Link
                href="/login"
                className="font-semibold text-[#6366f1] transition-colors hover:text-[#4f46e5]"
              >
                الرجوع لتسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </section>

      {/* Right Side - Image */}
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
