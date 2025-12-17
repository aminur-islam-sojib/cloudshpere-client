import DashboardLayout from "@/Layouts/DashboardLayout";
import ProtectedRoute from "@/Layouts/ProtectedLayout";
import RootLayout from "@/Layouts/RootLayout";
import Login from "@/Pages/Auth/Login";
import Register from "@/Pages/Auth/Register";
import ClubForm from "@/Pages/CreateGroup";
import Home from "@/Pages/Home";
import UsersPage from "@/Pages/Dashboard/UsersPage";
import ReportsPage from "@/Pages/Dashboard/ReportsPage";
import SettingsPage from "@/Pages/Dashboard/SettingsPage";
import { createBrowserRouter } from "react-router";
import AdminRoute from "@/Layouts/AdminRoute";
import RequestedGroupPage from "@/Pages/Dashboard/RequestedGroupPage";
import UsersGroupPage from "@/Pages/Dashboard/UsersGroupPage";
import DashboardHome from "@/Pages/Dashboard/DashboardHome";
import ManagerRoute from "@/Layouts/ManagerRoute";
import MyClubs from "@/Pages/Dashboard/MyGroups";
import Clubs from "@/Pages/Clubs/Clubs";
import ClubDetails from "@/Pages/Clubs/ClubDetails";
import PaymentCancelPage from "@/Pages/Payment/PaymentCancel";
import PaymentSuccessPage from "@/Pages/Payment/PaymentSuccessPage";
import JoinedClub from "@/Pages/Dashboard/JoinedClub";
import ClubInbox from "@/Pages/Clubs/ClubInbox";
import Events from "@/Pages/Events/Events";
import EventDetails from "@/Pages/Events/EventDetails";
import CreateEvent from "@/Pages/Events/CreateEvent";
import AllEvents from "@/Pages/Events/AllEvents";

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
      {
        path: "clubs",
        element: <Clubs />,
      },
      {
        path: "clubs/:id",
        element: <ClubDetails />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "events/:id",
        element: <EventDetails />,
      },
      {
        path: "create-event",
        element: (
          <ProtectedRoute>
            <CreateEvent />
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
        element: (
          <AdminRoute>
            <ReportsPage />,
          </AdminRoute>
        ),
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "requested-group",
        element: (
          <AdminRoute>
            <RequestedGroupPage />,
          </AdminRoute>
        ),
      },
      {
        path: "users-group",
        element: (
          <AdminRoute>
            <UsersGroupPage />,
          </AdminRoute>
        ),
      },
      {
        path: "my-clubs",
        element: (
          <ManagerRoute>
            <MyClubs />
          </ManagerRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccessPage />,
      },
      {
        path: "payment-cancel",
        element: <PaymentCancelPage />,
      },
      {
        path: "accessed-club",
        element: <JoinedClub />,
      },
      {
        path: "club-inbox/:id",
        element: <ClubInbox />,
      },
      {
        path: "club-event-manager/:id",
        element: <Events />,
      },
      {
        path: "manager/events",
        element: <AllEvents></AllEvents>,
      },
      {
        path: "event-details/:id",
        element: <EventDetails />,
      },
    ],
  },
]);
