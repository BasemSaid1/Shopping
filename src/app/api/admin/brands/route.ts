import { proxyMultipart } from "@/lib/proxyMultipart";

export async function POST(request: Request) {
  return proxyMultipart(request, {
    method: "POST",
    url: "/brand",
    fields: ["name", "categories"],
    files: ["file"],
    requiredFiles: ["file"],
  });
}
