import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";

/* Components */
import UserStartups, { StartupCardSkeleton } from "@/components/UserStartups";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const experimental_ppr = true;

/**
 * root page of user -> [id].
 * Displays user info.
 * Uses PPR technique.
 * First loads the shell static content.
 * Then loads the User Startups list upon user request to this page (dynamically).
 * UserStartups used in the <Suspense/> with a Skeleton fallback from shadcn. 
 * Suspense marks UserStartups as a dynamic part.
 */
async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const session = await auth();

  //fetch author's info from db
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  if (!user) return notFound();

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>
          <Image
            src={user.image}
            alt={user.name}
            width={220}
            height={220}
            className="profile_image"
          />
          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === id ? "Your" : "All"} Startups
          </p>
          <ul className="card-grid-sm">
            <Suspense fallback={<StartupCardSkeleton/>}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
}
export default page;
