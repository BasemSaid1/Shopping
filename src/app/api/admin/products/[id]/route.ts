import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";
import { proxyMultipart } from "@/lib/proxyMultipart";

const MONGO_ID = /^[a-f\d]{24}$/i;

const notFound = () =>
  NextResponse.json(
    { success: false, message: "المنتج غير موجود" },
    { status: 404 },
  );

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!MONGO_ID.test(id)) return notFound();

  return proxyMultipart(request, {
    method: "PATCH",
    url: `/product/${id}`,
    fields: ["title", "description", "price", "stock", "brand", "category"],
    files: ["file", "files"],
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!MONGO_ID.test(id)) return notFound();

  return proxyAuthed({ method: "DELETE", url: `/product/${id}` }, () => ({
    ok: true,
  }));
}
