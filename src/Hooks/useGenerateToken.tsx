/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import axiosPublic from "./axiosPublic";

const useGenerateToken = (user: any) => {
  useEffect(() => {
    const generateToken = async () => {
      if (!user) {
        console.log("user not found");
        return;
      }

      try {
        const res = await axiosPublic.post("/api/auth/jwt", {
          email: user.email,
          name: user.displayName || "User",
          photoURL: user.photoURL || "",
        });
        const token = res.data.token;

        localStorage.setItem("jwt_token", token);
      } catch (error) {
        console.error("Error generating token:", error);
      }
    };

    generateToken();
  }, [user]);
};

export default useGenerateToken;
