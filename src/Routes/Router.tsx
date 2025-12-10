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
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
