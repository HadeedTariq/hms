import axios from "axios";
let url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const authApi = axios.create({
  baseURL: `${url}/auth`,
  withCredentials: true,
});

const managerApi = axios.create({
  baseURL: `${url}/hotel-manager`,
  withCredentials: true,
});

export { authApi, managerApi };
