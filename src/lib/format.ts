export function formatPrice(value: number) {
  return `${value.toLocaleString("ar-EG")} ج.م`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
