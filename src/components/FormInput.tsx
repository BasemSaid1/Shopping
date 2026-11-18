"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  error?: string | false;
}

export default function FormInput({
  icon,
  error,
  type,
  ...props
}: FormInputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </span>

        <input
          {...props}
          type={isPassword && show ? "text" : type}
          className={`w-full rounded-xl border bg-white py-3.5 ps-11 text-sm font-medium text-gray-900 caret-[#6366f1] outline-none transition-all duration-200 placeholder:font-normal placeholder:text-gray-400 focus:ring-4 focus:ring-[#6366f1]/10 ${
            isPassword ? "pe-11" : "pe-4"
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-gray-300 hover:border-gray-400 focus:border-[#6366f1]"
          }`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-[#6366f1]"
            aria-label="إظهار أو إخفاء كلمة المرور"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
