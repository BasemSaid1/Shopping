import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/authHeader";
import { GENERIC_ERROR, translateError } from "@/lib/translateError";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png"];

export async function PATCH(request: Request) {
  const authorization = await getAuthHeader();
  if (!authorization) {
    return NextResponse.json(
      { success: false, message: "سجّل الدخول أولاً" },
      { status: 401 },
    );
  }

  const incoming = await request.formData();
  const file = incoming.get("file");

  if (!(file instanceof File) || !ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { success: false, message: "اختر صورة بصيغة JPG أو PNG" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { success: false, message: "حجم الصورة أكبر من 5 ميجا" },
      { status: 400 },
    );
  }

  const body = new FormData();
  body.append("file", file, file.name);

  try {
    const res = await fetch(`${process.env.API_URL}/auth/profile-pic`, {
      method: "PATCH",
      headers: { authorization },
      body,
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const raw = json?.message;
      const messages: string[] = Array.isArray(raw)
        ? raw
        : raw
          ? [String(raw)]
          : [];
      const translated = [...new Set(messages.map(translateError))];
      return NextResponse.json(
        {
          success: false,
          message: translated.length ? translated.join("، ") : GENERIC_ERROR,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: { profilePic: json?.data?.user?.profilePic ?? null },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "تعذر الاتصال بالخادم" },
      { status: 502 },
    );
  }
}
