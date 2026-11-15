import { proxyMultipart } from "@/lib/proxyMultipart";

export async function POST(request: Request) {
  return proxyMultipart(request, {
    method: "POST",
    url: "/category",
    fields: ["name"],
    files: ["file"],
    requiredFiles: ["file"],
  });
}
