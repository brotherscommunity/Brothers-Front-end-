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

export const createPostAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    console.log("");
    const response = await authFetch(
      `blogs/write-blog`,
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
      const result = await response.json();

      //! revalidate cached page
      //revalidatePath("/");
      //! where to redirect
      //redirect("/profile/blogs/" + result.id);
    } else {
      throw new ApiError(response.statusText, "CreateBlogError");
    }
  });

export const updatePostAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    const response = await authFetch(
      `blogs/${input.id}/edit`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
      true
    );
    if (response.ok) {
      revalidatePath(`/blog/${input.id}`);
      redirect(`/blog/${input.id}`);
    } else {
      throw new ApiError(response.statusText, "CreateBlogError");
    }
  });
