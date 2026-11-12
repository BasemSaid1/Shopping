import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import type { ApiResponse, LoginResult } from "@/types";
import { handleBackendError } from "@/lib/handleBackendError";
import { setAuthCookies } from "@/lib/authCookies";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const { data: res } = await backend.post<ApiResponse<LoginResult>>(
      "/auth/login",
      { email: body.email, password: body.password },
    );

    const { token, role } = res.data;

    const response = NextResponse.json({ success: true, role });

    setAuthCookies(response, token, role);

    return response;
  } catch (error) {
    return handleBackendError(error);
  }
}
