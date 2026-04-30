import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/gym/userService";

export const useUserProfile = () => {
  return useQuery({
    queryFn: getUserProfile,
    queryKey: ["userProfile"],
  });
};
