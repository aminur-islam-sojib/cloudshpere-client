import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://club-sphere-serve.vercel.app",
});

export default axiosPublic;
