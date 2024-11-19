import Axios from "axios";

import { NEXT_PUBLIC_BACKEND_URL as API_URL } from "@/constants";

export const apiClient = Axios.create({
  baseURL: API_URL,
});
