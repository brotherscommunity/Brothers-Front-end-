import Pagination from "@/Components/Main/Pagination";
import PostCard from "@/Components/Main/Post/PostCard";
import { PROFILE_BLOGS_PER_PAGE } from "@/constants";
import { authFetch } from "@/lib/authFetch";
import { formatDate } from "@/lib/utils";

export enum BLOG_TYPES {
  Blog = "Blog",
  VBlog = "VBlog",
}

export async function BlogsSusspense({
  userId,
  page,
  type,
}: {
  userId: string;
  page: string;
  type: BLOG_TYPES;
}) {
  const blogs = await authFetch(
    `blogs/user/${type}/${userId}?page=${page}&pageSize=${PROFILE_BLOGS_PER_PAGE}`
  );
  if (!blogs || blogs.error) {
    return <div>Error fetching Blogs {blogs.message}</div>;
  }

  return (
    <section>
      {blogs.blogs.map((blog: any) => (
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
          isVideoPost={blog.blogType === BLOG_TYPES.VBlog}
          blogId={blog.id}
          userId={userId}
        />
      ))}
      <div className="mr-12 mb-14">
        <Pagination
          TotalNumberOfResults={blogs.count}
          pageSize={PROFILE_BLOGS_PER_PAGE}
        />
      </div>
    </section>
  );
}
