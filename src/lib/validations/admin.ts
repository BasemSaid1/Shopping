import { z } from "zod";
import { toNumber } from "@/lib/digits";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "الاسم لا يقل عن حرفين")
    .max(20, "الاسم لا يزيد عن 20 حرفًا"),
  logo: z.custom<File | null>(),
});

export const brandFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "الاسم لا يقل عن حرفين")
    .max(20, "الاسم لا يزيد عن 20 حرفًا"),
  categories: z.array(z.string()).min(1, "اختر فئة واحدة على الأقل"),
  logo: z.custom<File | null>(),
});

export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "العنوان لا يقل عن حرفين")
    .max(200, "العنوان لا يزيد عن 200 حرف"),
  description: z.string().trim().max(2000, "الوصف لا يزيد عن 2000 حرف"),
  price: z
    .string()
    .trim()
    .min(1, "السعر مطلوب")
    .refine(
      (v) => Number.isFinite(toNumber(v)) && toNumber(v) >= 1,
      "السعر لازم يكون رقم 1 أو أكبر",
    ),
  stock: z
    .string()
    .trim()
    .min(1, "المخزون مطلوب")
    .refine(
      (v) => Number.isInteger(toNumber(v)) && toNumber(v) >= 0,
      "المخزون لازم يكون رقم صحيح 0 أو أكبر",
    ),
  category: z.string().min(1, "اختر الفئة"),
  brand: z.string().min(1, "اختر الماركة"),
  image: z.custom<File | null>(),
  gallery: z.custom<File[]>(),
});

export const couponFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "الكود لا يقل عن 3 أحرف")
    .max(20, "الكود لا يزيد عن 20 حرفًا")
    .regex(/^[A-Za-z0-9_-]+$/, "حروف إنجليزية وأرقام و - _ فقط"),
  discountPercentage: z
    .string()
    .trim()
    .min(1, "نسبة الخصم مطلوبة")
    .refine(
      (v) =>
        Number.isInteger(toNumber(v)) && toNumber(v) >= 1 && toNumber(v) <= 100,
      "النسبة رقم صحيح من 1 إلى 100",
    ),
  maxUsageCount: z
    .string()
    .trim()
    .min(1, "عدد مرات الاستخدام مطلوب")
    .refine(
      (v) => Number.isInteger(toNumber(v)) && toNumber(v) >= 1,
      "لازم يكون رقم صحيح 1 أو أكبر",
    ),
  expiryDate: z
    .string()
    .min(1, "تاريخ الانتهاء مطلوب")
    .refine(
      (v) => new Date(`${v}T23:59:59`).getTime() > Date.now(),
      "تاريخ الانتهاء لازم يكون في المستقبل",
    ),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type BrandFormValues = z.infer<typeof brandFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
export type CouponFormValues = z.infer<typeof couponFormSchema>;
