import { useAuth } from "@/Context/AuthContext";
import { axiosSecure } from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useGetRole = () => {
  const { user } = useAuth();

  const {
    data: role,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/getRole/${user.email}`);
      return res.data.role;
    },
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
  });

  return { role, isLoading, isError, refetch };
};

export default useGetRole;
