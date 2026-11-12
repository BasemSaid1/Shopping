import { NextResponse } from "next/server";
import axios from "axios";

export function handleBackendError(error: unknown) {
  if (axios.isAxiosError(error) && error.response) {
    const message = error.response.data?.message;
    return NextResponse.json(
      {
        success: false,
        message: Array.isArray(message)
          ? message.join("، ")
          : (message ?? "حدث خطأ غير متوقع"),
      },
      { status: error.response.status },
    );
  }

  return NextResponse.json(
    { success: false, message: "تعذر الاتصال بالخادم" },
    { status: 502 },
  );
}
