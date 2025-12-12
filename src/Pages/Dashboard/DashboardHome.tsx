import AdminRoute from "@/Layouts/AdminRoute";
import AdminDasHome from "./AdminDasHome";
import ManagerRoute from "@/Layouts/ManagerRoute";

const DashboardHome = () => {
  return (
    <div>
      <AdminRoute>
        <AdminDasHome />
      </AdminRoute>
      <ManagerRoute>
        <h1>Hi</h1>
      </ManagerRoute>
      <h1>Hi</h1>
    </div>
  );
};

export default DashboardHome;
