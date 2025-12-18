import useGetRole from "@/Hooks/useGetRole";
import type { ReactNode } from "react";
import AppLoader from "@/components/Shared/Loader/AppLoader";

type ChildrenType = {
  children: ReactNode;
};

const ManagerRoute = ({ children }: ChildrenType) => {
  const { role, isLoading } = useGetRole();

  if (isLoading) {
    return <AppLoader />;
  }

  if (role !== "manager") {
    return;
  }
  return children;
};

export default ManagerRoute;
