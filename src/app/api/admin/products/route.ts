import { proxyAuthed } from "@/lib/authProxy";
import { proxyMultipart } from "@/lib/proxyMultipart";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit")) || 10),
  );
  const search = searchParams.get("search")?.trim();

  return proxyAuthed({
    method: "GET",
    url: "/product",
    params: { page, limit, ...(search ? { search } : {}) },
  });
}

export async function POST(request: Request) {
  return proxyMultipart(request, {
    method: "POST",
    url: "/product",
    fields: [
      "title",
      "description",
      "price",
      "stock",
      "brand",
      "category",
      "options",
      "variants",
    ],
    files: ["file", "files"],
    requiredFiles: ["file"],
  });
}
