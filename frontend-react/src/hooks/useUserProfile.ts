import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/userService";

export const useUserProfile = () => {
  return useQuery({
    queryFn: getUserProfile,
    queryKey: ["userProfile"],
  });
};
