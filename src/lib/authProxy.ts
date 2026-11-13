import { NextResponse } from "next/server";
import type { AxiosRequestConfig } from "axios";
import { backend } from "@/lib/backend";
import { getAuthHeader } from "@/lib/authHeader";
import { handleBackendError } from "@/lib/handleBackendError";

export async function proxyAuthed<T = unknown>(
  config: AxiosRequestConfig,
  pick?: (payload: T) => unknown,
) {
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

    if (pick) {
      return NextResponse.json({ ...data, data: pick(data.data as T) });
    }

    return NextResponse.json(data);
  } catch (error) {
    return handleBackendError(error);
  }
}
