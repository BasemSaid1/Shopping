// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";
// import { useFormik } from "formik";
// import { FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
// import { api } from "@/lib/api";
// import { zodValidate } from "@/lib/zodValidate";
// import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
// import FormInput from "@/components/FormInput";
// import GoogleLoginButton from "@/components/GoogleLoginButton";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState("");

//   const formik = useFormik<RegisterValues>({
//     initialValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       gender: "MALE",
//     },
//     validate: zodValidate(registerSchema),
//     onSubmit: async (values) => {
//       setServerError("");
//       const email = values.email.trim();

//       try {
//         await api.post("/auth/signup", {
//           firstName: values.firstName.trim(),
//           lastName: values.lastName.trim(),
//           email,
//           password: values.password,
//           gender: values.gender,
//         });
//         router.push(`/verify-email?email=${encodeURIComponent(email)}`);
//       } catch (err) {
//         setServerError(
//           axios.isAxiosError(err)
//             ? (err.response?.data?.message ?? "حدث خطأ غير متوقع")
//             : "حدث خطأ غير متوقع",
//         );
//       }
//     },
//   });

//   const err = (name: keyof RegisterValues) =>
//     formik.touched[name] && formik.errors[name];

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
//       <form
//         noValidate
//         onSubmit={formik.handleSubmit}
//         className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
//       >
//         <h1 className="text-center text-2xl font-bold text-gray-800">
//           إنشاء حساب جديد
//         </h1>

//         {serverError && (
//           <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
//             {serverError}
//           </p>
//         )}

//         <div className="grid grid-cols-2 gap-3">
//           <FormInput
//             icon={<FaUser />}
//             placeholder="الاسم الأول"
//             {...formik.getFieldProps("firstName")}
//             error={err("firstName")}
//           />
//           <FormInput
//             icon={<FaUser />}
//             placeholder="الاسم الأخير"
//             {...formik.getFieldProps("lastName")}
//             error={err("lastName")}
//           />
//         </div>

//         <FormInput
//           icon={<FaEnvelope />}
//           type="email"
//           placeholder="البريد الإلكتروني"
//           {...formik.getFieldProps("email")}
//           error={err("email")}
//         />

//         <FormInput
//           icon={<FaLock />}
//           type="password"
//           placeholder="كلمة المرور"
//           {...formik.getFieldProps("password")}
//           error={err("password")}
//         />

//         <FormInput
//           icon={<FaLock />}
//           type="password"
//           placeholder="تأكيد كلمة المرور"
//           {...formik.getFieldProps("confirmPassword")}
//           error={err("confirmPassword")}
//         />

//         <select
//           {...formik.getFieldProps("gender")}
//           className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
//         >
//           <option value="MALE">ذكر</option>
//           <option value="FEMALE">أنثى</option>
//         </select>

//         <button
//           type="submit"
//           disabled={formik.isSubmitting}
//           className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//         >
//           {formik.isSubmitting && <FaSpinner className="animate-spin" />}
//           {formik.isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
//         </button>

//         <div className="flex items-center gap-3 text-sm text-gray-400">
//           <span className="h-px flex-1 bg-gray-200" />
//           أو
//           <span className="h-px flex-1 bg-gray-200" />
//         </div>

//         <GoogleLoginButton onFail={setServerError} />

//         <p className="text-center text-sm text-gray-600">
//           عندك حساب؟{" "}
//           <Link href="/login" className="font-semibold text-blue-600">
//             تسجيل الدخول
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
import { FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import { zodValidate } from "@/lib/zodValidate";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import FormInput from "@/components/FormInput";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const formik = useFormik<RegisterValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "MALE",
    },
    validate: zodValidate(registerSchema),
    onSubmit: async (values) => {
      setServerError("");
      const email = values.email.trim();

      try {
        await api.post("/auth/signup", {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email,
          password: values.password,
          gender: values.gender,
        });
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } catch (err) {
        setServerError(
          axios.isAxiosError(err)
            ? (err.response?.data?.message ?? "حدث خطأ غير متوقع")
            : "حدث خطأ غير متوقع",
        );
      }
    },
  });

  const err = (name: keyof RegisterValues) =>
    formik.touched[name] && formik.errors[name];

  return (
    <main className="min-h-screen bg-[#f8f8fa] lg:grid lg:grid-cols-2">
      {/* Register Form */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-7">
            <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              إنشاء حساب جديد
            </h1>

            <p className="text-sm leading-7 text-gray-500">
              انضم إلينا واستمتع بتجربة تسوق سهلة ومميزة.
            </p>
          </div>

          <form noValidate onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Server Error */}
            {serverError && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </p>
            )}

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  الاسم الأول
                </label>

                <FormInput
                  icon={<FaUser />}
                  placeholder="الاسم الأول"
                  {...formik.getFieldProps("firstName")}
                  error={err("firstName")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  الاسم الأخير
                </label>

                <FormInput
                  icon={<FaUser />}
                  placeholder="الاسم الأخير"
                  {...formik.getFieldProps("lastName")}
                  error={err("lastName")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                البريد الإلكتروني
              </label>

              <FormInput
                icon={<FaEnvelope />}
                type="email"
                placeholder="example@email.com"
                {...formik.getFieldProps("email")}
                error={err("email")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                كلمة المرور
              </label>

              <FormInput
                icon={<FaLock />}
                type="password"
                placeholder="أدخل كلمة المرور"
                {...formik.getFieldProps("password")}
                error={err("password")}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                تأكيد كلمة المرور
              </label>

              <FormInput
                icon={<FaLock />}
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                {...formik.getFieldProps("confirmPassword")}
                error={err("confirmPassword")}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                النوع
              </label>

              <select
                {...formik.getFieldProps("gender")}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-700 outline-none transition focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10"
              >
                <option value="MALE">ذكر</option>
                <option value="FEMALE">أنثى</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6366f1] py-4 font-bold text-white shadow-lg shadow-[#6366f1]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#4f46e5] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting && <FaSpinner className="animate-spin" />}

              {formik.isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب جديد"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1 text-sm text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              أو
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google Login */}
            <GoogleLoginButton onFail={setServerError} />

            {/* Login Link */}
            <p className="pt-2 text-center text-sm text-gray-500">
              عندك حساب بالفعل؟{" "}
              <Link
                href="/login"
                className="font-bold text-[#6366f1] transition hover:text-[#4f46e5]"
              >
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </section>

      {/* Right Image */}
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src="./images/auth2.jfif"
          alt="Shopping store"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />
      </section>
    </main>
  );
}
