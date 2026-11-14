import { NextResponse } from "next/server";
import axios from "axios";
import { GENERIC_ERROR, translateError } from "@/lib/translateError";

export function handleBackendError(error: unknown) {
  if (axios.isAxiosError(error) && error.response) {
    const raw = error.response.data?.message;
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
      { status: error.response.status },
    );
  }

  return NextResponse.json(
    { success: false, message: "تعذر الاتصال بالخادم" },
    { status: 502 },
  );
}
