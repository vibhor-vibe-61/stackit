import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authService = {
  register: (data) => axios.post(`${API}/auth/register`, data),
  login: (data) => axios.post(`${API}/auth/login`, data).then((res) => {
    localStorage.setItem("token", res.data.token);
    return res;
  }),
  logout: () => localStorage.removeItem("token"),
};

export default authService;