import axios from "axios";
import { host } from "../utils/secrets/host";

export const api = axios.create({
  baseURL: `http://${host}:3333`,
});
