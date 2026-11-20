import { proxyAuthed } from "@/lib/authProxy";

const ROLES = ["USER", "ADMIN"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 10),
  );
  const search = (searchParams.get("search") ?? "").trim().slice(0, 50);
  const role = searchParams.get("role") ?? "";
  const verified = searchParams.get("verified") ?? "";

  return proxyAuthed({
    method: "GET",
    url: "/user/admin/list",
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(ROLES.includes(role) ? { role } : {}),
      ...(verified === "true" || verified === "false" ? { verified } : {}),
    },
  });
}
