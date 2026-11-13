import { z } from "zod";

export const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .trim()
    .min(10, "اكتب العنوان بالتفصيل (10 أحرف على الأقل)")
    .max(300, "العنوان طويل جدًا"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+20|0)?1[0125]\d{8}$/,
      "رقم موبايل مصري غير صحيح (مثال: 01012345678)",
    ),
  paymentMethod: z.enum(["CARD", "CASH"]),
  coupon: z.string().trim().max(30, "كود الخصم غير صحيح"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
