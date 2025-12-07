import Navbar from "@/components/Shared/Navbar/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div>
      <div className=" sticky top-0 z-50">
        <Navbar />
      </div>
      <Outlet />
    </div>
  );
};

export default RootLayout;
