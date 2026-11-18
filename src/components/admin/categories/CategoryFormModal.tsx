"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import { FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { zodValidate } from "@/lib/zodValidate";
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/lib/validations/admin";
import type { Category } from "@/types";
import AdminModal from "../AdminModal";
import ImagePicker from "../ImagePicker";

export default function CategoryFormModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const editing = Boolean(category);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<CategoryFormValues>({
    initialValues: { name: category?.name ?? "", logo: null },
    validate: (values) => {
      const errors: Record<string, string> = {
        ...zodValidate(categoryFormSchema)(values),
      };
      if (!editing && !values.logo) errors.logo = "اللوجو مطلوب";
      return errors;
    },
    onSubmit: async (values) => {
      setServerError("");

      const form = new FormData();
      form.append("name", values.name.trim());
      if (values.logo) form.append("file", values.logo);

      try {
        if (category) {
          await api.patch(`/admin/categories/${category._id}`, form, {
            timeout: 60000,
          });
        } else {
          await api.post("/admin/categories", form, { timeout: 60000 });
        }
        onSaved();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/categories");
          return;
        }
        setServerError(getErrorMessage(err));
      }
    },
  });

  return (
    <AdminModal
      title={editing ? "تعديل الفئة" : "إضافة فئة"}
      onClose={formik.isSubmitting ? () => {} : onClose}
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            اسم الفئة
          </label>
          <input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 caret-[#6366f1] placeholder:text-gray-400 outline-none transition focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-xs text-red-600">{formik.errors.name}</p>
          )}
        </div>

        <ImagePicker
          label="اللوجو"
          currentUrl={category?.logo}
          error={
            formik.touched.name || formik.submitCount > 0
              ? formik.errors.logo
              : undefined
          }
          onChange={(file) => formik.setFieldValue("logo", file)}
        />

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
