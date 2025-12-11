import { useAuth } from "@/Context/AuthContext";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UsersGroupPage = () => {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["user-requested-group"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/pending/${user?.email}`);
      return res.data;
    },
  });
  console.log(data);
  return (
    <div>
      <h1>Hi</h1>
    </div>
  );
};

export default UsersGroupPage;
