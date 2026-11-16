import { z } from "zod";

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

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type BrandFormValues = z.infer<typeof brandFormSchema>;
