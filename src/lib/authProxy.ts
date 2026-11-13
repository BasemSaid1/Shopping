import { NextResponse } from "next/server";
import type { AxiosRequestConfig } from "axios";
import { backend } from "@/lib/backend";
import { getAuthHeader } from "@/lib/authHeader";
import { handleBackendError } from "@/lib/handleBackendError";

export async function proxyAuthed(config: AxiosRequestConfig) {
  const authorization = await getAuthHeader();

  if (!authorization) {
    return NextResponse.json(
      { success: false, message: "سجّل الدخول أولاً" },
      { status: 401 },
    );
  }

  try {
    const { data } = await backend.request({
      ...config,
      headers: { ...config.headers, authorization },
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleBackendError(error);
  }
}
