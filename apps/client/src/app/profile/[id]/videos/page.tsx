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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogsSusspense userId={userId} page={page} type={BLOG_TYPES.VBlog} />
    </Suspense>
  );
}
