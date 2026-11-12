import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "البريد الإلكتروني مطلوب")
  .email("صيغة البريد الإلكتروني غير صحيحة");

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} يجب ألا يقل عن حرفين`)
    .max(20, `${label} يجب ألا يزيد عن 20 حرفًا`);

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const registerSchema = z
  .object({
    firstName: nameField("الاسم الأول"),
    lastName: nameField("الاسم الأخير"),
    email: emailField,
    password: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    gender: z.enum(["MALE", "FEMALE"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  confirmEmailOTP: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "الكود يتكون من 6 أرقام"),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "الكود يتكون من 6 أرقام"),
    newPassword: z.string().min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
