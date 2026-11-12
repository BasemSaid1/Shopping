import type { ZodType } from "zod";

export function zodValidate<T>(schema: ZodType<T>) {
  return (values: T) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return errors;
  };
}
