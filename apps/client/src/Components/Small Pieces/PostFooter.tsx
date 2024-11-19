"use client";
import { dislikeAction, likeAction } from "@/app/_actions/blog";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { authFetch } from "@/lib/authFetch";
import { queryClient } from "@/lib/react-query";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { formatNumber } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { cache, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineComment,
} from "react-icons/ai";
import { IoStatsChartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useServerAction } from "zsa-react";

interface PostFooter {
  tags: string[];
  blogId: string;
}

interface Stat {
  likesCount: number;
  dislikesCount: number;
  [key: string]: number;
}

const fetchBlogStat = async (id: string) => {
  return apiClient.get(`/blogs/${id}/stat`);
};

const fetchUserReaction = async (id: string) => {
  return authFetch(`blogs/${id}/reaction`);
};

export default function PostFooter({ tags, blogId }: PostFooter) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const [cachedCounts, setCachedCounts] = useState({
    likesCount: 0,
    dislikesCount: 0,
    commentsCount: 0,
    viewsCount: 0,
  });

  const { toast } = useToast();

  const { isPending, isError, data } = useQuery({
    queryKey: ["stat", blogId],
    queryFn: () => fetchBlogStat(blogId),
  });

  const {
    isPending: isReactionPending,
    isError: isReactinError,
    data: reactionData,
    error,
  } = useQuery({
    queryKey: ["reaction", blogId],
    queryFn: () => fetchUserReaction(blogId),
  });

  const { execute: likeExecute } = useServerAction(likeAction, {
    onSuccess: () => {
      console.log("oops");
      queryClient.invalidateQueries({ queryKey: ["reaction", blogId] });
      queryClient.invalidateQueries({ queryKey: ["stat", blogId] });
    },
  });

  const { execute: dislikeExecute } = useServerAction(dislikeAction, {
    onSuccess: () => {
      console.log("oops");
      queryClient.invalidateQueries({ queryKey: ["reaction", blogId] });
      queryClient.invalidateQueries({ queryKey: ["stat", blogId] });
    },
  });

  const onReact = (reaction: string = "like") => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        description: "Please sign up to react.",
      });
    }
    if (reaction === "like") {
      likeExecute({ id: blogId });
    } else {
      dislikeExecute({ id: blogId });
    }
  };

  const { likesCount, dislikesCount, commentsCount, viewsCount } =
    useMemo(() => {
      if (isPending || isError) return cachedCounts;
      console.log("updated");
      return data.data;
    }, [data]);

  const { reaction = undefined } =
    isPending || isError ? {} : reactionData || {};

  return (
    <section className="mt-16 flex flex-wrap gap-5 items-center justify-between">
      <div className="flex items-center gap-4">
        <h3 className="text-base text-black font-semibold"> Tags: </h3>
        <span className="flex items-center gap-3">
          {tags.map((tag, index) => (
            <button key={index} className="text-sm hover:text-blue-500">
              {tag}
            </button>
          ))}
        </span>
      </div>
      <div className="flex items-center max-sm:gap-6 gap-3">
        {isError ? (
          <p className="text-red-500">Something went wrong</p>
        ) : (
          <>
            <div>{/* {JSON.stringify(reactionData)} */}</div>
            <span className="flex items-center gap-2">
              <IoStatsChartOutline className="w-5 h-5 text-black font-semibold" />
              <p> {formatNumber(viewsCount)} </p>
            </span>
            <span className="flex items-center gap-2">
              <AiOutlineComment className="w-5 h-5 text-black font-semibold" />
              <p> {formatNumber(commentsCount)} </p>
            </span>
            <span className="flex items-center gap-2" onClick={() => onReact()}>
              <AiOutlineLike
                className={cn(
                  "w-5 h-5 text-black font-semibold cursor-pointer",
                  {
                    "text-orangeRed": reaction === "LIKE",
                  }
                )}
              />
              <p> {formatNumber(likesCount)} </p>
            </span>
            <span
              className="flex items-center gap-2"
              onClick={() => onReact("dislike")}
            >
              <AiOutlineDislike
                className={cn(
                  "w-5 h-5 text-black font-semibold cursor-pointer",
                  {
                    "text-orangeRed": reaction === "DISLIKE",
                  }
                )}
              />
              <p> {formatNumber(dislikesCount)} </p>
            </span>
          </>
        )}
      </div>
    </section>
  );
}
