import { proxyAuthed } from "@/lib/authProxy";

const STATUSES = [
  "PENDING",
  "PAID",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 10),
  );
  const status = searchParams.get("status") ?? "";

  return proxyAuthed({
    method: "GET",
    url: "/order/admin/list",
    params: { page, limit, ...(STATUSES.includes(status) ? { status } : {}) },
  });
}
