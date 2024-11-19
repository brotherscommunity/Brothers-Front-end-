import Pagination from "@/Components/Main/Pagination";
import PostCard from "@/Components/Main/Post/PostCard";
import PostList from "@/Components/Main/Post/PostList";
import ProfileHeader from "@/Components/Main/ProfileHeader";
import BlogCatagoryList from "@/Components/Small Pieces/BlogCatagoryList";
import { FAKE_BLOG_CATAGORIES, PROFILE_BLOGS_PER_PAGE } from "@/constants";
import { authFetch } from "@/lib/authFetch";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";
import { BLOG_TYPES, BlogsSusspense } from "../_components/blogs-suspense";

interface Props {
  searchParams: {
    page: string;
  };
  params: {
    id: string;
  };
}
export default function page({ searchParams, params }: Props) {
  const page = searchParams.page || "1";
  const userId = params.id;
  // TODO: Calculate how many catagories does all blogs have
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogsSusspense userId={userId} page={page} type={BLOG_TYPES.Blog} />
    </Suspense>
  );
}

// async function BlogsSusspense({
//   userId,
//   page,
// }: {
//   userId: string;
//   page: string;
// }) {
//   const blogs = await authFetch(
//     `blogs/user/${userId}?page=${page}&pageSize=${PROFILE_BLOGS_PER_PAGE}`
//   );
//   if (!blogs || blogs.error) {
//     return <div>Error fetching Blogs {blogs.message}</div>;
//   }

//   return (
//     <section>
//       {blogs.blogs.map((blog: any) => (
//         <PostCard
//           key={blog.id}
//           postedBy={`${blog.author.firstName} ${blog.author.lastName}`}
//           date={formatDate(blog.createdAt)}
//           title={blog.title}
//           description={blog.content}
//           tags={blog.tags}
//           likes={186}
//           dislikes={0}
//           comments={25}
//           totalViews={1200}
//           isVideoPost={blog.type === "VBlog"}
//         />
//       ))}
//       <div className="mr-12 mb-14">
//         <Pagination
//           TotalNumberOfResults={blogs.count}
//           pageSize={PROFILE_BLOGS_PER_PAGE}
//         />
//       </div>
//     </section>
//   );
// }
