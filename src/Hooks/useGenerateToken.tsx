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
        const res = await axiosPublic.post("/generateToken", user);
        const token = res.data;

        localStorage.setItem("jwt_token", token);
        console.log("JWT Saved:", token);
      } catch (error) {
        console.error("Error generating token:", error);
      }
    };

    generateToken();
  }, [user]);
};

export default useGenerateToken;
