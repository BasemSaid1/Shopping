import { NextResponse } from "next/server";
import { getAuthHeader } from "@/lib/authHeader";
import { GENERIC_ERROR, translateError } from "@/lib/translateError";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_BYTES = 4 * 1024 * 1024;

interface Options {
  method: "POST" | "PATCH";
  url: string;
  fields: string[];
  files?: string[];
  requiredFiles?: string[];
}

const fail = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status });

export async function proxyMultipart(
  request: Request,
  { method, url, fields, files = [], requiredFiles = [] }: Options,
) {
  const authorization = await getAuthHeader();
  if (!authorization) return fail("سجّل الدخول أولاً", 401);

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return fail("بيانات غير صالحة", 400);
  }

  const body = new FormData();

  for (const name of fields) {
    const value = incoming.get(name);
    if (typeof value === "string" && value.trim() !== "") {
      body.append(name, value.trim());
    }
  }

  for (const name of files) {
    const list = incoming
      .getAll(name)
      .filter((v): v is File => v instanceof File && v.size > 0);

    for (const file of list) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return fail("اختر صورًا بصيغة JPG أو PNG أو WebP", 400);
      }
      if (file.size > MAX_FILE_BYTES) {
        return fail("حجم الصورة كبير جدًا", 400);
      }
      body.append(name, file, file.name);
    }

    if (requiredFiles.includes(name) && list.length === 0) {
      return fail("الصورة مطلوبة", 400);
    }
  }

  try {
    const res = await fetch(`${process.env.API_URL}${url}`, {
      method,
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
      return fail(
        translated.length ? translated.join("، ") : GENERIC_ERROR,
        res.status,
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return fail("تعذر الاتصال بالخادم", 502);
  }
}
