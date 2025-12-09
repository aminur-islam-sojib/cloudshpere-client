// src/layouts/ProtectedLayout.tsx
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/Context/AuthContext";
import type { ReactNode } from "react";

type ChildrenType = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ChildrenType) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <Navigate to={`/log-in`} replace state={{ from: location.pathname }} />
    );
  }

  return children;
};

export default ProtectedRoute;
