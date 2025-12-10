import { useAuth } from "@/Context/AuthContext";

import { useEffect, useState } from "react";
import { axiosSecure } from "./useAxiosSecure";

const useGetRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get(`/getRole/${user.email}`);
        console.log(res.data);
        setUserRole(res.data.role);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user?.email]);

  return userRole;
};

export default useGetRole;
