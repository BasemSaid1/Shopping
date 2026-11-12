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
    <div>
      <div className="relative">
        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          {...props}
          type={isPassword && show ? "text" : type}
          className={`w-full rounded-lg border py-3 ps-10 outline-none ${
            isPassword ? "pe-10" : "pe-4"
          } ${error ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="إظهار أو إخفاء كلمة المرور"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
