import AdminDasHome from "./AdminDasHome";
import ManagerDasHome from "./ManagerDashboardHome";
import MemberDasHome from "./MemberDasHome";
import useGetRole from "@/Hooks/useGetRole";
import AppLoader from "@/components/Shared/Loader/AppLoader";

const DashboardHome = () => {
  const { role, isLoading } = useGetRole();

  if (isLoading) {
    return <AppLoader />;
  }

  // Render different dashboard based on user role
  if (role === "admin") {
    return <AdminDasHome />;
  } else if (role === "clubManager") {
    return <ManagerDasHome />;
  } else {
    return <MemberDasHome />;
  }
};

export default DashboardHome;
