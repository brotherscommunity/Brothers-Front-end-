// import VideoBlog from "@/Components/Main/forms/VideoBlog";
// import TopPageHeader from "@/Components/Small Pieces/TopPageHeader";

// export default function page() {
//   return (
//     <main className="max-md:px-5 md:px-7 xl:px-20 mb-28">
//       <TopPageHeader
//         pageCode="PG-32"
//         pageName="Create video blog page"
//         pageDescription="Bring your ideas to life with video"
//       />
//       <div className="mt-14">
//         <h3 className="text-xl text-black font-semibold">
//           {" "}
//           Create Video Blog{" "}
//         </h3>
//       </div>
//       <VideoBlog />
//     </main>
//   );
// }

import VideoBlog from "@/Components/Main/forms/VideoBlog";
import TopPageHeader from "@/Components/Small Pieces/TopPageHeader";
import { authFetch } from "@/lib/authFetch";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function page({ params }: { params: { id: string } }) {
  return (
    <main className="max-md:px-5 md:px-7 xl:px-20 mb-28">
      <TopPageHeader
        pageCode="PG-32"
        pageName="Create video blog page"
        pageDescription="Bring your ideas to life with video"
      />

      <div className="mt-16">
        <h3 className="text-black text-xl font-semibold"> Edit Video Post </h3>
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
      <VideoBlog vblogData={blog} />
    </div>
  );
}
