import useGetRole from "@/Hooks/useGetRole";
import type { ReactNode } from "react";

type ChildrenType = {
  children: ReactNode;
};

const ManagerRoute = ({ children }: ChildrenType) => {
  const { role, isLoading } = useGetRole();

  if (isLoading) {
    return;
  }

  if (role !== "manager") {
    return;
  }
  return children;
};

export default ManagerRoute;