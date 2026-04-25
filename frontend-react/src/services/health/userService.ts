import { healthPrivateApi } from "../../clients";

export const healthDeleteUser = async () => {
  healthPrivateApi.delete("/me");
};
