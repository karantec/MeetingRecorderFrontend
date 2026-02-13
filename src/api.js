import axios from "axios";
const BASE =
  import.meta.env.VITE_API_URL ||
  "https://meeting-tracker-backend.onrender.com";
export const api = axios.create({ baseURL: BASE });
