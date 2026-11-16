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

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type BrandFormValues = z.infer<typeof brandFormSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;
