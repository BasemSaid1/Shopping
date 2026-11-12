import { NextResponse } from "next/server";
import { backend } from "@/lib/backend";
import { handleBackendError } from "@/lib/handleBackendError";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    await backend.post("/auth/signup", {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      gender: body.gender,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleBackendError(error);
  }
}
