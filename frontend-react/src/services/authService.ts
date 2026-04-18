import { publicApi } from "../clients";
import type { GeneralResponse } from "../types/ApiResponse";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
  const response = await publicApi.post<SignInResponse>("/auth/sign-in", data);
  return response.data;
};

export const signUp = async (data: SignUpRequest): Promise<GeneralResponse> => {
  const response = await publicApi.post<GeneralResponse>("/auth/sign-up", data);
  return response.data;
};

export const signOut = async (data: {
  refreshToken: string;
}): Promise<GeneralResponse> => {
  const response = await publicApi.post<GeneralResponse>(
    "/auth/sign-out",
    data
  );
  return response.data;
};
