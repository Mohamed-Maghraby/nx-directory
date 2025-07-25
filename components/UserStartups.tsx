import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupCardType } from "./StartupCard";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

/**
 * Fetches startups by user id.
 * Displays the startups to thi specific suer in <StartupCard/> if there is startups
 */
export default async function UserStartups({ id }: { id: string }) {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });
  console.log(startups);
  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: StartupCardType) => {
          return <StartupCard key={startup?._id} post={startup} />;
        })
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
}

/**
 * A skeleton wrapper typically creates hard-coded array an loops on in to render the skeleton n times to give user the illusion
 * that component is rendering
 */
export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((i: number) => {
      <li key={cn("skeleton", i)}>
        <Skeleton className="startup_card_skeleton" />
      </li>;
    })}
  </>
);
