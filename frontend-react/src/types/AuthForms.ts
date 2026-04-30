export interface RegisterLoginForm {
  height: number | string;
  weight: number | string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
