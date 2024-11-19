import Bio from "@/Components/Main/Bio";
import ProfileHeader from "@/Components/Main/ProfileHeader";
import TopPageHeader from "@/Components/Small Pieces/TopPageHeader";
import { authFetch } from "@/lib/authFetch";
import { notFound } from "next/navigation";
import { Suspense } from "react";

//! caching all users have /profile page how is this cached, use /profile/id instead

export default async function Header({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <section>
      <Suspense>
        <ProfileSuspense userId={id} />
      </Suspense>
    </section>
  );
}

async function ProfileSuspense({ userId }: { userId: string }) {
  const user = await authFetch("user/" + userId, {}, true);
  if (!user) notFound();
  return (
    <>
      <TopPageHeader
        pageCode="PG32"
        pageName={`${user.firstName} ${user?.lastName}`}
        pageDescription="All information about the profile"
      />
      <ProfileHeader
        firstName={user.firstName}
        lastName={user.lastName}
        id={userId}
      />
    </>
  );
}
