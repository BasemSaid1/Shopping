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
  productFormSchema,
  type ProductFormValues,
} from "@/lib/validations/admin";
import {
  initialDraft,
  toPayload,
  validateVariants,
  type OptionDraft,
  type VariantRow,
} from "@/lib/variantDraft";
import type { Brand, Category, Product } from "@/types";
import AdminModal from "../AdminModal";
import ImagePicker from "../ImagePicker";
import MultiImagePicker from "../MultiImagePicker";
import VariantsEditor from "./VariantsEditor";

type ProductFormState = ProductFormValues & {
  hasVariants: boolean;
  options: OptionDraft[];
  variantRows: VariantRow[];
};

// Vercel بيرفض أي طلب أكبر من حوالي 4.5MB
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_GALLERY = 10;

const inputClass =
  "w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function FieldError({ children }: { children?: string }) {
  return children ? (
    <p className="mt-1 text-xs text-red-600">{children}</p>
  ) : null;
}

export default function ProductFormModal({
  product,
  categories,
  brands,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const editing = Boolean(product);
  const [serverError, setServerError] = useState("");

  const draft = initialDraft(product);
  const hadVariants = (product?.variants?.length ?? 0) > 0;

  const formik = useFormik<ProductFormState>({
    initialValues: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "",
      category: product?.category?._id ?? "",
      brand: product?.brand?._id ?? "",
      image: null,
      gallery: [],
      hasVariants: hadVariants,
      options: draft.options,
      variantRows: draft.rows,
    },
    validate: (values) => {
      // لو المنتج له متغيّرات، السعر والمخزون العاديين مش مطلوبين
      const errors: Record<string, string> = {
        ...zodValidate(productFormSchema)(
          values.hasVariants ? { ...values, price: "1", stock: "0" } : values,
        ),
      };
      if (values.hasVariants) {
        const variantsError = validateVariants(
          values.options,
          values.variantRows,
        );
        if (variantsError) errors.variantsError = variantsError;
      }
      if (!editing && !values.image) errors.image = "الصورة الرئيسية مطلوبة";

      const total =
        (values.image?.size ?? 0) +
        values.gallery.reduce((sum, f) => sum + f.size, 0);
      if (total > MAX_TOTAL_BYTES) {
        errors.gallery =
          "إجمالي حجم الصور كبير (الحد الأقصى 4 ميجا)، قلّل الصور";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setServerError("");

      const form = new FormData();
      form.append("title", values.title.trim());
      if (values.description.trim()) {
        form.append("description", values.description.trim());
      }
      if (values.hasVariants) {
        const payload = toPayload(values.options, values.variantRows);
        form.append("options", JSON.stringify(payload.options));
        form.append("variants", JSON.stringify(payload.variants));
      } else {
        form.append("price", String(toNumber(values.price)));
        form.append("stock", String(toNumber(values.stock)));
        // تحويل منتج له متغيّرات لمنتج عادي
        if (hadVariants) {
          form.append("options", "[]");
          form.append("variants", "[]");
        }
      }
      form.append("category", values.category);
      form.append("brand", values.brand);
      if (values.image) form.append("file", values.image);
      values.gallery.forEach((f) => form.append("files", f));

      try {
        if (product) {
          await api.patch(`/admin/products/${product._id}`, form, {
            timeout: 90000,
          });
        } else {
          await api.post("/admin/products", form, { timeout: 90000 });
        }
        onSaved();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push("/login?redirect=/admin/products");
          return;
        }
        setServerError(getErrorMessage(err));
      }
    },
  });

  // الماركات المتاحة للفئة المختارة بس (الباك اند بيفرض إن الماركة تتبع الفئة)
  const availableBrands = brands.filter((b) =>
    b.categories.some((c) => c._id === formik.values.category),
  );

  function onCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    formik.setFieldValue("category", category);

    const stillValid = brands.some(
      (b) =>
        b._id === formik.values.brand &&
        b.categories.some((c) => c._id === category),
    );
    if (!stillValid) formik.setFieldValue("brand", "");
  }

  const submitted = formik.submitCount > 0;
  const show = (name: keyof ProductFormValues) =>
    (formik.touched[name] || submitted) &&
    typeof formik.errors[name] === "string"
      ? (formik.errors[name] as string)
      : undefined;

  return (
    <AdminModal
      title={editing ? "تعديل المنتج" : "إضافة منتج"}
      onClose={formik.isSubmitting ? () => {} : onClose}
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            اسم المنتج
          </label>
          <input
            id="title"
            name="title"
            autoComplete="off"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          <FieldError>{show("title")}</FieldError>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            الوصف (اختياري)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />
          <FieldError>{show("description")}</FieldError>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <input
            type="checkbox"
            checked={formik.values.hasVariants}
            onChange={(e) => {
              const on = e.target.checked;
              formik.setFieldValue("hasVariants", on);
              if (on && formik.values.options.length === 0) {
                formik.setFieldValue("options", [{ name: "", values: [] }]);
              }
            }}
            className="mt-1 h-4 w-4 accent-blue-600"
          />
          <span>
            <span className="block text-sm font-semibold text-gray-800">
              المنتج له خيارات (مقاس، لون، سعة...)
            </span>
            <span className="block text-xs text-gray-500">
              كل تركيبة ليها سعر ومخزون خاص بيها.
            </span>
          </span>
        </label>

        {hadVariants && !formik.values.hasVariants && (
          <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
            هيتحول لمنتج عادي، والتركيبات والأسعار الخاصة بيها هتتمسح. لازم تحدد
            سعر ومخزون واحد.
          </p>
        )}

        {formik.values.hasVariants ? (
          <VariantsEditor
            options={formik.values.options}
            rows={formik.values.variantRows}
            error={
              submitted
                ? (formik.errors as Record<string, string | undefined>)
                    .variantsError
                : undefined
            }
            onChange={(options, rows) => {
              formik.setFieldValue("options", options);
              formik.setFieldValue("variantRows", rows);
            }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                السعر (ج.م)
              </label>
              <input
                id="price"
                name="price"
                inputMode="decimal"
                autoComplete="off"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              />
              <FieldError>{show("price")}</FieldError>
            </div>
            <div>
              <label
                htmlFor="stock"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                المخزون
              </label>
              <input
                id="stock"
                name="stock"
                inputMode="numeric"
                autoComplete="off"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass}
              />
              <FieldError>{show("stock")}</FieldError>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              الفئة
            </label>
            <select
              id="category"
              name="category"
              value={formik.values.category}
              onChange={onCategoryChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            >
              <option value="">اختر الفئة</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError>{show("category")}</FieldError>
          </div>

          <div>
            <label
              htmlFor="brand"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              الماركة
            </label>
            <select
              id="brand"
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.category}
              className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
            >
              <option value="">
                {formik.values.category ? "اختر الماركة" : "اختر الفئة الأول"}
              </option>
              {availableBrands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
            {formik.values.category && availableBrands.length === 0 && (
              <p className="mt-1 text-xs text-yellow-700">
                مفيش ماركات مرتبطة بالفئة دي. أضف ماركة لها من صفحة الماركات.
              </p>
            )}
            <FieldError>{show("brand")}</FieldError>
          </div>
        </div>

        <ImagePicker
          label="الصورة الرئيسية"
          currentUrl={product?.image}
          error={submitted ? formik.errors.image : undefined}
          onChange={(file) => formik.setFieldValue("image", file)}
        />

        <MultiImagePicker
          label="معرض الصور (اختياري)"
          max={MAX_GALLERY}
          currentUrls={product?.gallery ?? []}
          hint={
            editing
              ? "اختيار صور جديدة بيستبدل المعرض الحالي بالكامل."
              : `لحد ${MAX_GALLERY} صور.`
          }
          error={submitted ? (formik.errors.gallery as string) : undefined}
          onChange={(files) => formik.setFieldValue("gallery", files)}
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
