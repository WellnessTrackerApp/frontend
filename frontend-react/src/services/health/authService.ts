import { healthPublicApi } from "../../clients";

export interface SignUpRequest {
  id: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  height: number;
  weight: number;
  gender: "MALE" | "FEMALE";
}

export const healthSignUp = async (data: SignUpRequest) => {
  await healthPublicApi.post("/register", data);
};
