import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./Routes/Router.tsx";
import { AuthProvider } from "./Context/AuthContext.tsx";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />{" "}
      </AuthProvider>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  </StrictMode>
);
