"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useFormik } from "formik";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { zodValidate } from "@/lib/zodValidate";
import { brandFormSchema, type BrandFormValues } from "@/lib/validations/admin";
import type { Brand, Category } from "@/types";
import AdminModal from "../AdminModal";
import ImagePicker from "../ImagePicker";

export default function BrandFormModal({
  brand,
  categories,
  onClose,
  onSaved,
}: {
  brand: Brand | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const editing = Boolean(brand);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<BrandFormValues>({
    initialValues: {
      name: brand?.name ?? "",
      categories: brand?.categories.map((c) => c._id) ?? [],
      logo: null,
    },
    validate: (values) => {
      const errors: Record<string, string> = {
        ...zodValidate(brandFormSchema)(values),
      };
      if (!editing && !values.logo) errors.logo = "اللوجو مطلوب";
      return errors;
    },
    onSubmit: async (values) => {
      setServerError("");

      const form = new FormData();
      form.append("name", values.name.trim());
      form.append("categories", JSON.stringify(values.categories));
      if (values.logo) form.append("file", values.logo);

      try {
        if (brand) {
          await api.patch(`/admin/brands/${brand._id}`, form, {
            timeout: 60000,
          });
        } else {
          await api.post("/admin/brands", form, { timeout: 60000 });
        }
        onSaved();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/brands");
          return;
        }
        setServerError(getErrorMessage(err));
      }
    },
  });

  function toggleCategory(id: string) {
    const current = formik.values.categories;
    formik.setFieldValue(
      "categories",
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
    formik.setFieldTouched("categories", true, false);
  }

  const submitted = formik.submitCount > 0;
  const categoriesError =
    (formik.touched.categories || submitted) &&
    typeof formik.errors.categories === "string"
      ? formik.errors.categories
      : undefined;

  return (
    <AdminModal
      title={editing ? "تعديل الماركة" : "إضافة ماركة"}
      onClose={formik.isSubmitting ? () => {} : onClose}
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            اسم الماركة
          </label>
          <input
            id="name"
            name="name"
            autoComplete="off"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 caret-[#6366f1] placeholder:text-gray-400 outline-none transition focus:border-[#6366f1] focus:ring-4 focus:ring-[#6366f1]/10"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-xs text-red-600">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-gray-700">
            الفئات
          </span>
          {categories.length === 0 ? (
            <p className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
              مفيش فئات لسه. أضف فئة الأول من صفحة الفئات.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const selected = formik.values.categories.includes(c._id);
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => toggleCategory(c._id)}
                    aria-pressed={selected}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selected && <FaCheck className="text-xs" />}
                    {c.name}
                  </button>
                );
              })}
            </div>
          )}
          {categoriesError && (
            <p className="mt-1 text-xs text-red-600">{categoriesError}</p>
          )}
        </div>

        <ImagePicker
          label="اللوجو"
          currentUrl={brand?.logo}
          error={submitted ? formik.errors.logo : undefined}
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
