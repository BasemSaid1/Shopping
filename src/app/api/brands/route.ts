import { proxyAuthed } from "@/lib/authProxy";
import type { Brand } from "@/types";

export async function GET() {
  return proxyAuthed<Brand[]>({ method: "GET", url: "/brand" }, (list) =>
    list.map(({ _id, name, logo, categories }) => ({
      _id,
      name,
      logo,
      categories: (categories ?? []).map((c) => ({
        _id: c._id,
        name: c.name,
      })),
    })),
  );
}
