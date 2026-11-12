import axios from "axios";

export const backend = axios.create({
  baseURL: process.env.API_URL,
  timeout: 15000,
});
