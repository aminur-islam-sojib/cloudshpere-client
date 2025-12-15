import AdminDasHome from "./AdminDasHome";
import ManagerDasHome from "./ManagerDashboardHome";
import MemberDasHome from "./MemberDasHome";
import useGetRole from "@/Hooks/useGetRole";

const DashboardHome = () => {
  const { role, isLoading } = useGetRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
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
