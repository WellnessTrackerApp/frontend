import { healthPublicApi } from "../../clients";
import type { GeneralResponse } from "../../types/ApiResponse";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  birthDate: string;
  height: number;
  weight: number;
  gender: "MALE" | "FEMALE" | "OTHER";
}

export interface SignUpResponse {
  message: string;
}

export const signUp = async (data: SignUpRequest): Promise<GeneralResponse> => {
  const response = await healthPublicApi.post<GeneralResponse>(
    "/auth/sign-up",
    data,
  );
  return response.data;
};
