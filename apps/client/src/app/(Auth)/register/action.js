"use server";

import { NEXT_PUBLIC_BACKEND_URL } from "@/constants";

import { redirect } from "next/navigation";
import { createServerAction } from "zsa";
import * as z from "zod";
import { ApiError } from "@/lib/error";

export const registerAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    // return JSON.stringify(response);
    console.log(JSON.stringify(input));
    if (response.ok) {
      redirect("/signin");
    } else throw new ApiError(response.message, "SignUpError");
  });

export const incrementNumberAction = createServerAction().handler(async () => {
  // Sleep for .5 seconds
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Increment the input number by 1
  return 3;
});
