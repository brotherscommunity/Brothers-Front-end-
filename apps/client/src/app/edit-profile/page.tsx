import EditProfile from "@/Components/Main/forms/Edit Profile/EditProfile";
import TopPageHeader from "@/Components/Small Pieces/TopPageHeader";
import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function page() {
  //TODO: Fetch All the User's Data -> getAllUserData
  // const userData = {
  //     firstName: "Abebe",
  //     lastName: "Balcha",
  //     city: "Addis Ababa",
  //     country: "Ethiopia",
  //     userName: "abebe1234"
  // }

  return (
    <main className="max-md:px-5 md:px-7 xl:px-20 mb-28">
      <TopPageHeader
        pageCode="PG32"
        pageName="Edit profile page"
        pageDescription="Update your profile information"
      />
      <EditSuspense />
    </main>
  );
}

async function EditSuspense() {
  const userData = await authFetch("auth/full-profile");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mt-14">
        <EditProfile userData={userData} />
      </div>
      {JSON.stringify(userData)}
    </Suspense>
  );
}
