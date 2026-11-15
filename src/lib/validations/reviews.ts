import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "اختر تقييمًا من 1 إلى 5")
    .max(5, "اختر تقييمًا من 1 إلى 5"),
  comment: z
    .string()
    .trim()
    .min(3, "التعليق لا يقل عن 3 أحرف")
    .max(500, "التعليق لا يزيد عن 500 حرف"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;
