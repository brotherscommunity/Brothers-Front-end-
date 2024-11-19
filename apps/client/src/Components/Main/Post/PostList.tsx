"use client";

import { authFetch } from "@/lib/authFetch";
import PostCard from "./PostCard";
import { Suspense, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { HOME_PAGE_SIZE } from "@/constants";
import { formatDate } from "@/lib/utils";
import Pagination from "../Pagination";
import { useSearchParams } from "next/navigation";

interface PostListProps {
  isVideoPost?: boolean;
}
// TODO: Fetch the posts
const fetchBlogsList = async (page: number, pageSize: number) => {
  return apiClient.get(`/blogs/list?page=${page}&pageSize=${pageSize}`);
};
export default function PostList({ isVideoPost = false }: PostListProps) {
  //   const Posts = Array.from({ length: 6 }, (post, i) => {
  //     return (
  //       <PostCard
  //         key={i}
  //         postedBy="Marcus Ray"
  //         date="8 Jan 2024"
  //         title="Cultivate Mental Wellness"
  //         description=" Health goes beyond the physical. Nurturing mental well-being is equally vital. Practice mindfulness, engage in activities...Health goes beyond the physical. Nurturing mental well-being is equally vital. Practice mindfulness, engage in activities..."
  //         tags={["Personal Blog", "Health"]}
  //         likes={186}
  //         dislikes={0}
  //         comments={25}
  //         totalViews={1200}
  //         isVideoPost={isVideoPost}
  //       />
  //     );
  //   });
  //   return (
  //     <main className="mt-10 xl:pr-10">
  //       {/*  Simulating an array of Posts fetched from the Database */}
  //       {Posts}
  //     </main>
  //   );

  // const [page, setPage] = useState<number>(1);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: () => fetchBlogsList(currentPage, HOME_PAGE_SIZE),
    placeholderData: keepPreviousData,
    staleTime: 60 * 60 * 60,
  });

  return (
    <main className="mt-10 xl:pr-10">
      {isError ? (
        <div>{JSON.stringify(error)}</div>
      ) : isPending ? (
        <div>Loading...</div>
      ) : (
        // (
        //   <div>{JSON.stringify(data.data.blogs)}</div>
        // )

        <div>
          {data.data.blogs.map((blog) => (
            //<div key={blog.id}>{JSON.stringify(blog)}</div>
            <PostCard
              key={blog.id}
              postedBy={`${blog.author.firstName} ${blog.author.lastName}`}
              date={formatDate(blog.createdAt)}
              title={blog.title}
              description={blog.content}
              tags={blog.tags}
              likes={186}
              dislikes={0}
              comments={25}
              totalViews={1200}
              isVideoPost={blog.type === "VBlog"}
            />
          ))}
          <div className="md:mr-10">
            <Pagination
              TotalNumberOfResults={data.data.count}
              pageSize={HOME_PAGE_SIZE}
            />
          </div>
        </div>
      )}
    </main>
  );
}

async function PostListSuspend() {
  const blogs = await authFetch("blogs/list?page=1&pageSize=6");
  return <div>{JSON.stringify(blogs)}</div>;
}
