import { healthPublicApi } from "../../clients";
import type { GeneralResponse } from "../../types/ApiResponse";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  birthDate: string;
  height: number;
  weight: number;
  gender: string;
}

export interface SignUpResponse {
  message: string;
}

export const healthSignUp = async (
  data: SignUpRequest,
): Promise<GeneralResponse> => {
  const response = await healthPublicApi.post<GeneralResponse>(
    "/register",
    data,
  );
  return response.data;
};
