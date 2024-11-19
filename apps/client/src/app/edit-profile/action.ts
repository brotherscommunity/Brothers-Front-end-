"use server";

import { NEXT_PUBLIC_BACKEND_URL } from "@/constants";

import { redirect } from "next/navigation";
import { createServerAction } from "zsa";
import * as z from "zod";
import { ApiError } from "@/lib/error";
import { AFTER_LOGIN_URL } from "@/constants";
import { createSession } from "@/lib/session";
import { USER } from "@/constants";
import { revalidatePath } from "next/cache";
import { authFetch } from "@/lib/authFetch";

export const updateProfileAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    console.log("");
    const response = await authFetch(
      `user/update-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
      true
    );
    if (response.ok) {
      //! revalidate after fixing profile page caching
      //revalidatePath("/");
      redirect("/profile");
    } else {
      console.log("here is the problem", response.status, response.ok);
      throw new ApiError(response.statusText, "UpdateProfileError");
    }
  });
