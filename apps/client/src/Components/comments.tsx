"use client";

import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import Avatar from "@/Components/Small Pieces/Avatar";
import CommentForm from "./comment-form";

interface Comment {
  id: number;
  author: { lastName: string; firstName: string };
  content: string;
  createdAt: string;
  [key: string]: any;
}

const fetchComments = async (id: string) => {
  return apiClient.get(`/blogs/${id}/comments`);
};

export default function Comments({ blogId }: { blogId: string }) {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => fetchComments(blogId),
  });

  return (
    <section>
      <CommentForm blogId={blogId} />
      <div>
        {isPending ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Something went wrong!</div>
        ) : (
          <div className="flex flex-col gap-6 my-8">
            {data.data.map((comment: Comment) => (
              <div className="flex gap-4" key={comment.id}>
                <Avatar />
                <div className="flex flex-col">
                  <p className="text-gray-700">
                    {comment.author.firstName} {comment.author.lastName}
                  </p>
                  <div>{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
