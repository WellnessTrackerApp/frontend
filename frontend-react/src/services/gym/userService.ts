import { healthPrivateApi } from "../../clients";

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  birthDate: string;
  height: number;
  weight: number;
  gender: "MALE" | "FEMALE";
}

export interface UpdateUserMetricsRequest {
  height: number;
  weight: number;
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await healthPrivateApi.get("/me");
  return response.data;
};

export const updateUserMetrics = async (request: UpdateUserMetricsRequest) => {
  await healthPrivateApi.put("/me", request);
};
