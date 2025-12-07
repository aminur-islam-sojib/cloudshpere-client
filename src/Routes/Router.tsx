import RootLayout from "@/Layouts/RootLayout";
import Login from "@/Pages/Auth/Login";
import Home from "@/Pages/Home";
import { createBrowserRouter } from "react-router-dom";

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
    ],
  },
]);
