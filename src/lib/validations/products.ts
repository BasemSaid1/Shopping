import { z } from "zod";

const priceField = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0),
    "أدخل رقمًا صحيحًا (0 أو أكثر)",
  );

export const productFiltersSchema = z
  .object({
    sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]),
    minPrice: priceField,
    maxPrice: priceField,
    inStock: z.boolean(),
  })
  .refine(
    (d) =>
      d.minPrice === "" ||
      d.maxPrice === "" ||
      Number(d.minPrice) <= Number(d.maxPrice),
    {
      message: "الحد الأدنى أكبر من الحد الأقصى",
      path: ["maxPrice"],
    },
  );

export type ProductFiltersValues = z.infer<typeof productFiltersSchema>;
