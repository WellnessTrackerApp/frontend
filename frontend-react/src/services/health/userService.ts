import { healthPublicApi } from "../../clients";

export const healthDeleteUser = async (username: string, password: string) => {
  await healthPublicApi.delete("/me", {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
};
