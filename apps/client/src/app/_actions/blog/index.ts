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

export const postCommentAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    const { id } = input;
    delete input.id;
    const response = await authFetch(
      `blogs/${id}/write-comment`,
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

export const likeAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    const { id } = input;
    const response = await authFetch(
      `blogs/${id}/like`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
      true
    );
    if (response.ok) {
      return true;
    } else {
      throw new ApiError(response.statusText, "LikeApiError");
    }
  });

export const dislikeAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    const { id } = input;
    const response = await authFetch(
      `blogs/${id}/dislike`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
      true
    );
    if (response.ok) {
      return true;
    } else {
      throw new ApiError(response.statusText, "LikeApiError");
    }
  });

export const deleteBlogAction = createServerAction()
  .input(z.object({}).passthrough())
  .handler(async ({ input }) => {
    const { id, userId } = input;
    const response = await authFetch(
      `blogs/${id}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
      true
    );
    if (response.ok) {
      revalidatePath(`/profile/${userId}/blogs`);
      return true;
    } else {
      throw new ApiError(response.statusText, "DeleteApiError");
    }
  });
