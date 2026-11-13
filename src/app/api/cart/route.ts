import { proxyAuthed } from "@/lib/authProxy";

export async function GET() {
  return proxyAuthed({ method: "GET", url: "/cart" });
}
