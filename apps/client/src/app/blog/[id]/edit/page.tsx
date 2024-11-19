import ArticlesBlog from "@/Components/Main/forms/ArticlesBlog";
import TopPageHeader from "@/Components/Small Pieces/TopPageHeader";
import { authFetch } from "@/lib/authFetch";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function page({ params }: { params: { id: string } }) {
  return (
    <main className="max-md:px-5 md:px-7 xl:px-20 mb-28">
      <TopPageHeader
        pageCode="PG-32"
        pageName="Create blog post page"
        pageDescription="Share your thoughts, experiences, and expertise with a blog post"
      />
      <div className="mt-16">
        <h3 className="text-black text-xl font-semibold"> Edit Post </h3>
        <Suspense fallback={<div>Loading...</div>}>
          <EditSuspense id={params.id} />
        </Suspense>
      </div>
    </main>
  );
}

async function EditSuspense({ id }: { id: string }) {
  const blog = await authFetch(`blogs/${id}`);
  if (!blog || blog.error) notFound();
  return (
    <div>
      <ArticlesBlog postData={blog} />
    </div>
  );
}
