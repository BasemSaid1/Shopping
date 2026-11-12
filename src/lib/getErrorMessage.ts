import axios from "axios";

export function getErrorMessage(err: unknown) {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? "حدث خطأ غير متوقع";
  }
  return "حدث خطأ غير متوقع";
}
