import { toNumber } from "@/lib/digits";
import type { Product } from "@/types";

export const MAX_OPTIONS = 3;
export const MAX_VALUES = 30;
export const MAX_COMBOS = 100;

export interface OptionDraft {
  name: string;
  values: string[];
}

// صف لكل تركيبة. values بنفس ترتيب الخيارات (اللي ليها قيم)
export interface VariantRow {
  key: string;
  _id?: string;
  values: string[];
  price: string;
  stock: string;
  enabled: boolean;
}

const rowKey = (values: string[]) => JSON.stringify(values);

// الخيارات اللي ليها قيم بس هي اللي بتدخل في التركيبات
export const activeOptions = (options: OptionDraft[]) =>
  options.filter((o) => o.values.length > 0);

export function countCombos(options: OptionDraft[]) {
  const active = activeOptions(options);
  if (active.length === 0) return 0;
  return active.reduce((n, o) => n * o.values.length, 1);
}

function combos(options: OptionDraft[]): string[][] {
  const active = activeOptions(options);
  if (active.length === 0) return [];
  return active.reduce<string[][]>(
    (acc, o) => acc.flatMap((prefix) => o.values.map((v) => [...prefix, v])),
    [[]],
  );
}

// بيبني صفوف التركيبات من الخيارات، وبيحافظ على السعر والمخزون للصفوف الموجودة
export function buildRows(
  options: OptionDraft[],
  previous: VariantRow[],
  newRowsEnabled = true,
): VariantRow[] {
  if (countCombos(options) > MAX_COMBOS) return previous;

  const old = new Map(previous.map((r) => [r.key, r]));
  return combos(options).map((values) => {
    const key = rowKey(values);
    return (
      old.get(key) ?? {
        key,
        values,
        price: "",
        stock: "",
        enabled: newRowsEnabled,
      }
    );
  });
}

export function initialDraft(product: Product | null): {
  options: OptionDraft[];
  rows: VariantRow[];
} {
  if (!product || !product.options?.length || !product.variants?.length) {
    return { options: [], rows: [] };
  }

  const options = product.options.map((o) => ({
    name: o.name,
    values: [...o.values],
  }));

  const existing: VariantRow[] = product.variants.map((v) => {
    const values = options.map(
      (o) => v.attributes.find((a) => a.name === o.name)?.value ?? "",
    );
    return {
      key: rowKey(values),
      _id: v._id,
      values,
      price: String(v.price),
      stock: String(v.stock),
      enabled: true,
    };
  });

  // التركيبات اللي مش موجودة في المنتج بتظهر مقفولة، والأدمن يفعّلها لو عايز
  return { options, rows: buildRows(options, existing, false) };
}

export function validateVariants(
  options: OptionDraft[],
  rows: VariantRow[],
): string | null {
  if (options.length === 0) return "أضف خيارًا واحدًا على الأقل (مثل المقاس)";

  const names = new Set<string>();
  for (const o of options) {
    const name = o.name.trim();
    if (!name) return "اسم الخيار مطلوب";
    if (names.has(name.toLowerCase())) {
      return "أسماء الخيارات لازم تكون مختلفة";
    }
    names.add(name.toLowerCase());
    if (o.values.length === 0) {
      return `الخيار "${name}" محتاج قيمة واحدة على الأقل`;
    }
  }

  if (countCombos(options) > MAX_COMBOS) {
    return `عدد التركيبات أكبر من ${MAX_COMBOS}، قلّل القيم`;
  }

  const enabled = rows.filter((r) => r.enabled);
  if (enabled.length === 0) return "فعّل تركيبة واحدة على الأقل";

  const invalid = enabled.some((r) => {
    const price = toNumber(r.price);
    const stock = toNumber(r.stock);
    return (
      r.price.trim() === "" ||
      r.stock.trim() === "" ||
      !Number.isFinite(price) ||
      price < 1 ||
      !Number.isInteger(stock) ||
      stock < 0
    );
  });
  if (invalid) {
    return "السعر لازم 1 أو أكبر والمخزون رقم صحيح 0 أو أكبر في كل التركيبات المفعّلة";
  }

  return null;
}

// الشكل اللي الباك اند مستنيه (بيتبعت كنص JSON في الـ FormData)
export function toPayload(options: OptionDraft[], rows: VariantRow[]) {
  const active = activeOptions(options);

  return {
    options: options.map((o) => ({ name: o.name.trim(), values: o.values })),
    variants: rows
      .filter((r) => r.enabled)
      .map((r) => ({
        ...(r._id ? { _id: r._id } : {}),
        attributes: active.map((o, i) => ({
          name: o.name.trim(),
          value: r.values[i],
        })),
        price: toNumber(r.price),
        stock: toNumber(r.stock),
      })),
  };
}
