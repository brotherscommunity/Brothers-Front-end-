import { redirect } from "next/navigation";
import { createSession } from "./session";
import { NEXT_PUBLIC_BACKEND_URL, NEXT_API_URL } from "@/constants";
import { ApiError } from "./error";

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      //! response.error.message instead
      throw new ApiError(response.statusText, "Failed to refresh token1");
    }

    const { accessToken } = await response.json();
    console.log(accessToken, refreshToken, "worked");
    // update session with new tokens cant call update session here, it can be only called from server action
    const updateRes = await fetch(`${NEXT_API_URL}/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({
        accessToken,
      }),
    });

    if (!updateRes.ok)
      throw new ApiError(response.statusText, "Failed to refresh token2");

    return accessToken;
  } catch (err) {
    // console.error("Refresh Token failed:", err);
    console.error("Refresh Token failed:");
    return null;
  }
};
