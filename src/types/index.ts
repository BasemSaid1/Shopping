export type Role = "USER" | "ADMIN";

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export interface LoginResult {
  message: string;
  token: string;
  role: Role;
}
