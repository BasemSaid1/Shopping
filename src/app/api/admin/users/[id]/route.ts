import { NextResponse } from "next/server";
import { proxyAuthed } from "@/lib/authProxy";

const MONGO_ID = /^[a-f\d]{24}$/i;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!MONGO_ID.test(id)) {
    return NextResponse.json(
      { success: false, message: "المستخدم غير موجود" },
      { status: 404 },
    );
  }

  return proxyAuthed({ method: "DELETE", url: `/user/admin/${id}` }, () => ({
    ok: true,
  }));
}
