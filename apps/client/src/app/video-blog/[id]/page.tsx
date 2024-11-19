import Avatar from "@/Components/Small Pieces/Avatar";
import Image from "next/image";
import PostHeader from "../../../../public/blogPostHeader.jpg";
import DisplayContent from "@/Components/Main/Post/DisplayContent";
import PostFooter from "@/Components/Small Pieces/PostFooter";
import { formatNumber } from "@/utils";
import Link from "next/link";
import Decide from "@/Components/Small Pieces/Decide";
import TopPageHeader from "@/Components/Small Pieces/TopPageHeader";
import { authFetch } from "@/lib/authFetch";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import Comments from "@/Components/comments";

interface Props {
  params: {
    id: string;
  };
}

export default async function page({ params }: Props) {
  const postId = params.id;

  return (
    <main className="max-md:px-5 md:px-7 xl:px-20 mb-28">
      <TopPageHeader
        pageCode="PG32"
        pageName="Preview post page"
        pageDescription="Here you can preview you post before publishing it"
      />

      <Suspense fallback={<div>Loading..</div>}>
        <BlogSuspense id={postId} />
      </Suspense>
    </main>
  );
}

async function BlogSuspense({ id }: { id: string }) {
  const blog = await authFetch("blogs/" + id);
  if (!blog || blog.error) notFound();

  return (
    <>
      <div className="mt-20 flex items-center gap-6">
        <Avatar
          width="w-[50px]"
          height="h-[50px]"
          iconWidth="w-[20px]"
          iconHeight="h-[20px]"
        />
        <div className="flex items-center gap-3">
          <h3 className="text-lg text-black font-medium">
            By {blog.author.firstName} {blog.author.lastName}
          </h3>
          <p className="text-stone-500 text-sm">{formatDate(blog.createdAt)}</p>
        </div>
      </div>
      <h2 className="mt-10 pl-3 text-base text-black font-semibold">
        {blog.title}
      </h2>
      {/* To prevent content shifting */}
      <div className="max-w-[900px] max-h-[150px] pb-56">
        <Image
          src={PostHeader}
          alt="blog-post-header"
          width={700}
          height={100}
          className="mt-7 rounded-2xl"
        />
      </div>
      <div className="sm:mt-48 md:mt-52 xl:mt-56">
        <DisplayContent content={blog.content} />
      </div>

      <div className="mt-14">
        <h2 className="text-xl text-black font-semibold"> Refrences </h2>
        <div className="flex flex-col justify-start gap-4 mt-4">
          {blog.references.map((citation: string, i: number) => {
            return (
              <span
                key={citation}
                className="flex items-center gap-2 max-w-[350px] text-base text-black hover:text-blue-500"
              >
                <p> {i + 1} </p>
                <Link href={citation} target="_blank">
                  {citation}
                </Link>
              </span>
            );
          })}
        </div>
        <PostFooter blogId={id} tags={blog.tags} />
      </div>
      {/* <CommentForm parentId={3} blogCategoryId={4} /> */}
      <Comments blogId={id} />
    </>
  );
}
