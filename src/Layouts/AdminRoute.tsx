import useGetRole from "@/Hooks/useGetRole";
import type { ReactNode } from "react";

type ChildrenType = {
  children: ReactNode;
};

const AdminRoute = ({ children }: ChildrenType) => {
  const { role, isLoading } = useGetRole();

  if (isLoading) {
    return;
  }

  if (role !== "admin") {
    return;
  }
  return children;
};

export default AdminRoute;
