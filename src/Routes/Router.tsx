import DashboardLayout from "@/Layouts/DashboardLayout";
import ProtectedRoute from "@/Layouts/ProtectedLayout";
import RootLayout from "@/Layouts/RootLayout";
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import ClubForm from "@/Pages/CreateGroup";
import Home from "@/Pages/Home";
import DashboardHome from "@/Pages/Dashboard/DashboardHome";
import UsersPage from "@/Pages/Dashboard/UsersPage";
import ReportsPage from "@/Pages/Dashboard/ReportsPage";
import SettingsPage from "@/Pages/Dashboard/SettingsPage";
import { createBrowserRouter } from "react-router";
import AdminRoute from "@/Layouts/AdminRoute";
import RequestedGroupPage from "@/Pages/Dashboard/RequestedGroupPage";
import UsersGroupPage from "@/Pages/Dashboard/UsersGroupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/log-in",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "create-group",
        element: (
          <ProtectedRoute>
            <ClubForm />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <UsersPage />,
          </AdminRoute>
        ),
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "requested-group",
        element: <RequestedGroupPage />,
      },
      {
        path: "users-group",
        element: <UsersGroupPage />,
      },
    ],
  },
]);
