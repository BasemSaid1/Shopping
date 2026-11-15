import { proxyAuthed } from "@/lib/authProxy";
import type { Category } from "@/types";

export async function GET() {
  return proxyAuthed<Category[]>({ method: "GET", url: "/category" }, (list) =>
    list.map(({ _id, name, logo }) => ({ _id, name, logo })),
  );
}
