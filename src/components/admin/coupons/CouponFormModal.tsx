"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import { FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import { toNumber } from "@/lib/digits";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { zodValidate } from "@/lib/zodValidate";
import {
  couponFormSchema,
  type CouponFormValues,
} from "@/lib/validations/admin";
import type { Coupon } from "@/types";
import AdminModal from "../AdminModal";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

// ISO → YYYY-MM-DD بالتوقيت المحلي (لحقل type="date")
function toDateInput(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function FieldError({ children }: { children?: string }) {
  return children ? (
    <p className="mt-1 text-xs text-red-600">{children}</p>
  ) : null;
}

export default function CouponFormModal({
  coupon,
  onClose,
  onSaved,
}: {
  coupon: Coupon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const editing = Boolean(coupon);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<CouponFormValues>({
    initialValues: {
      code: coupon?.code ?? "",
      discountPercentage: coupon ? String(coupon.discountPercentage) : "",
      maxUsageCount: coupon ? String(coupon.maxUsageCount) : "",
      expiryDate: coupon ? toDateInput(coupon.expiryDate) : "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {
        ...zodValidate(couponFormSchema)(values),
      };
      if (
        coupon &&
        !errors.maxUsageCount &&
        toNumber(values.maxUsageCount) < coupon.usedCount
      ) {
        errors.maxUsageCount = `اتستخدم ${coupon.usedCount} مرة بالفعل، الحد لازم يكون أكبر أو يساوي كده`;
      }
      return errors;
    },
    onSubmit: async (values) => {
      setServerError("");

      const payload = {
        code: values.code.trim().toUpperCase(),
        discountPercentage: toNumber(values.discountPercentage),
        maxUsageCount: toNumber(values.maxUsageCount),
        // نهاية اليوم بتوقيت المستخدم
        expiryDate: new Date(`${values.expiryDate}T23:59:59`).toISOString(),
      };

      try {
        if (coupon) {
          await api.patch(`/admin/coupons/${coupon._id}`, payload);
        } else {
          await api.post("/admin/coupons", payload);
        }
        onSaved();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/coupons");
          return;
        }
        setServerError(getErrorMessage(err));
      }
    },
  });

  const submitted = formik.submitCount > 0;
  const show = (name: keyof CouponFormValues) =>
    formik.touched[name] || submitted ? formik.errors[name] : undefined;

  return (
    <AdminModal
      title={editing ? "تعديل الكوبون" : "إضافة كوبون"}
      onClose={formik.isSubmitting ? () => {} : onClose}
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            كود الخصم
          </label>
          <input
            id="code"
            name="code"
            dir="ltr"
            autoComplete="off"
            placeholder="SALE20"
            value={formik.values.code}
            onChange={(e) =>
              formik.setFieldValue("code", e.target.value.toUpperCase())
            }
            onBlur={formik.handleBlur}
            className={`${inputClass} font-mono uppercase`}
          />
          <FieldError>{show("code")}</FieldError>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="discountPercentage"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              نسبة الخصم %
            </label>
            <input
              id="discountPercentage"
              name="discountPercentage"
              inputMode="numeric"
              autoComplete="off"
              value={formik.values.discountPercentage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            />
            <FieldError>{show("discountPercentage")}</FieldError>
          </div>

          <div>
            <label
              htmlFor="maxUsageCount"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              أقصى عدد استخدامات
            </label>
            <input
              id="maxUsageCount"
              name="maxUsageCount"
              inputMode="numeric"
              autoComplete="off"
              value={formik.values.maxUsageCount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            />
            <FieldError>{show("maxUsageCount")}</FieldError>
          </div>
        </div>

        <div>
          <label
            htmlFor="expiryDate"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            ينتهي في
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formik.values.expiryDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          <FieldError>{show("expiryDate")}</FieldError>
          <p className="mt-1 text-xs text-gray-500">
            الكوبون بيتمسح تلقائيًا بعد انتهائه.
          </p>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {formik.isSubmitting && <FaSpinner className="animate-spin" />}
            {editing ? "حفظ التعديل" : "إضافة"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={formik.isSubmitting}
            className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            إلغاء
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
