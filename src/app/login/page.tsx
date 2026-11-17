// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";
// import { useFormik } from "formik";
// import {
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaSpinner,
// } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { zodValidate } from "@/lib/zodValidate";
// import { loginSchema, type LoginValues } from "@/lib/validations/auth";
// import GoogleLoginButton from "@/components/GoogleLoginButton";
// import { getRedirectTarget } from "@/lib/redirect";

// export default function LoginPage() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [serverError, setServerError] = useState("");

//   const formik = useFormik<LoginValues>({
//     initialValues: { email: "", password: "" },
//     validate: zodValidate(loginSchema),
//     onSubmit: async (values) => {
//       setServerError("");
//       try {
//         await api.post("/auth/login", {
//           email: values.email.trim(),
//           password: values.password,
//         });
//         router.push(getRedirectTarget());
//         router.refresh();
//       } catch (err) {
//         setServerError(
//           axios.isAxiosError(err)
//             ? (err.response?.data?.message ?? "حدث خطأ غير متوقع")
//             : "حدث خطأ غير متوقع",
//         );
//       }
//     },
//   });

//   const emailError = formik.touched.email && formik.errors.email;
//   const passwordError = formik.touched.password && formik.errors.password;

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
//       <form
//         noValidate
//         onSubmit={formik.handleSubmit}
//         className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
//       >
//         <h1 className="text-center text-2xl font-bold text-gray-800">
//           تسجيل الدخول
//         </h1>

//         {serverError && (
//           <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
//             {serverError}
//           </p>
//         )}

//         <div>
//           <div className="relative">
//             <FaEnvelope className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               {...formik.getFieldProps("email")}
//               className={`w-full rounded-lg border py-3 ps-10 pe-4 outline-none ${
//                 emailError
//                   ? "border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
//             />
//           </div>
//           {emailError && (
//             <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
//           )}
//         </div>

//         <div>
//           <div className="relative">
//             <FaLock className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="كلمة المرور"
//               {...formik.getFieldProps("password")}
//               className={`w-full rounded-lg border py-3 ps-10 pe-10 outline-none ${
//                 passwordError
//                   ? "border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               aria-label="إظهار أو إخفاء كلمة المرور"
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//           </div>
//           {passwordError && (
//             <p className="mt-1 text-sm text-red-600">
//               {formik.errors.password}
//             </p>
//           )}
//         </div>

//         <div className="text-end">
//           <Link href="/forgot-password" className="text-sm text-blue-600">
//             نسيت كلمة المرور؟
//           </Link>
//         </div>

//         <button
//           type="submit"
//           disabled={formik.isSubmitting}
//           className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//         >
//           {formik.isSubmitting && <FaSpinner className="animate-spin" />}
//           {formik.isSubmitting ? "جاري الدخول..." : "دخول"}
//         </button>

//         <div className="flex items-center gap-3 text-sm text-gray-400">
//           <span className="h-px flex-1 bg-gray-200" />
//           أو
//           <span className="h-px flex-1 bg-gray-200" />
//         </div>

//         <GoogleLoginButton onFail={setServerError} />

//         <p className="text-center text-sm text-gray-600">
//           ماعندكش حساب؟{" "}
//           <Link href="/register" className="font-semibold text-blue-600">
//             إنشاء حساب
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
import axios from "axios";
import { useFormik } from "formik";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { zodValidate } from "@/lib/zodValidate";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { getRedirectTarget } from "@/lib/redirect";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validate: zodValidate(loginSchema),
    onSubmit: async (values) => {
      setServerError("");
      try {
        await api.post("/auth/login", {
          email: values.email.trim(),
          password: values.password,
        });
        router.push(getRedirectTarget());
        router.refresh();
      } catch (err) {
        setServerError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? "حدث خطأ غير متوقع")
            : "حدث خطأ غير متوقع",
        );
      }
    },
  });

  const emailError = formik.touched.email && formik.errors.email;
  const passwordError = formik.touched.password && formik.errors.password;

  return (
    <main className="min-h-screen bg-[#f8f8fa] lg:grid lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-9">
            <p className="mb-3 text-sm font-semibold tracking-wide text-[#6366f1]">
              WELCOME BACK
            </p>

            <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              تسجيل الدخول
            </h1>

            <p className="text-sm leading-7 text-gray-500">
              أهلاً بعودتك! سجل دخولك للوصول إلى حسابك ومتابعة التسوق.
            </p>
          </div>

          <form noValidate onSubmit={formik.handleSubmit} className="space-y-5">
            {serverError && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </p>
            )}

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <FaEnvelope className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  placeholder="example@email.com"
                  {...formik.getFieldProps("email")}
                  className={`w-full rounded-xl border bg-white py-4 ps-11 pe-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-[#6366f1]/10 ${
                    emailError
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-[#6366f1]"
                  }`}
                />
              </div>

              {emailError && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                كلمة المرور
              </label>

              <div className="relative">
                <FaLock className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  {...formik.getFieldProps("password")}
                  className={`w-full rounded-xl border bg-white py-4 ps-11 pe-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-[#6366f1]/10 ${
                    passwordError
                      ? "border-red-400 focus:border-red-400"
                      : "border-gray-200 focus:border-[#6366f1]"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#6366f1]"
                  aria-label="إظهار أو إخفاء كلمة المرور"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {passwordError && (
                <p className="mt-2 text-xs text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-end">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#6366f1] transition hover:text-[#4f46e5]"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] py-4 font-bold text-white shadow-lg shadow-[#6366f1]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#4f46e5] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting && <FaSpinner className="animate-spin" />}
              {formik.isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2 text-sm text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              أو
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Login */}
            <GoogleLoginButton onFail={setServerError} />

            {/* Register */}
            <p className="pt-3 text-center text-sm text-gray-500">
              ماعندكش حساب؟{" "}
              <Link
                href="/register"
                className="font-bold text-[#6366f1] transition hover:text-[#4f46e5]"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </form>
        </div>
      </section>

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
