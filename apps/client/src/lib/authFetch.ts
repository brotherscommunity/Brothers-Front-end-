import { NEXT_PUBLIC_BACKEND_URL } from "@/constants";
import { refreshToken } from "./auth";
import { getSession } from "./session";

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const authFetch = async (
  url: string,
  options: FetchOptions = {},
  raw = false
) => {
  const session = await getSession();
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };
  let response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/${url}`, options);

  if (response.status === 401) {
    if (!session?.refreshToken) throw new Error("refresh token not found!");

    const newAccessToken = await refreshToken(session.refreshToken);

    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/${url}`, options);
    }
  }
  if (raw) return response;
  return await response.json();
};
