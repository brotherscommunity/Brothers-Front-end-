import Bio from "@/Components/Main/Bio";
import { authFetch } from "@/lib/authFetch";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <section>
      <Suspense>
        <BioSuspense userId={id} />
      </Suspense>
    </section>
  );
}

async function BioSuspense({ userId }: { userId: string }) {
  const user = await authFetch("user/" + userId);
  if (!user || user.error) notFound();
  return <Bio content={user.bio} />;
}
