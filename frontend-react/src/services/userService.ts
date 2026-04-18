import { privateApi } from "../clients";

export interface UserProfileResponse {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
  const response = await privateApi.get("/users/profile");
  return response.data;
};
