import { Suspense } from "react";
import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import markdownit from "markdown-it";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUPS_BY_ID_QUERY,
} from "@/sanity/lib/queries";

/* Components */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import View from "@/components/View";
import StartupCard, { StartupCardType } from "@/components/StartupCard";

//Activate prerendering
export const experimental_ppr = true;

//markdown instance
const md = markdownit();

/**
 * Startup page by id, this page catches a dynamic id by using [id] dynamic-segment.
 * It should catch the id as a param and display a startup page.
 * It parallel fetching both posts and playlist (a techniques used by next)
 * Displays author info and post details + render the post in markdown format.
 * Displays a playlist (editorPosts) if there is any.
 * Uses a React Subsense to dynamically displays post views and update it every time a visitor views the post.
 * 
 * Techniques used in this component: 
 * 1-PPR (Partial Prerendering) a strategy allows combining static and dynamic content at the same route.
 *  -Server sends a shell containing the static content.
 * -The shell leaves holes for the dynamic content that will load in asynchronously.
 * -The dynamic holes are streamed (fetched) in parallel.
 * -Include experimental_ppr = true to activate it, note: (this technique is yet experimental)
 * -Dynamic content needs to be marked with a "Suspense", with a fallback (usually a skelton or normal jsx).
 * -Using Suspense creates a "Dynamic Boundary" inside a static boundary, this tells next load the static first, suspend the dynamic and 
 * use a fallback until static is or user requests the dynamic content.
 * 
 * 2-Parallel Fetching.
 * -Using Promise.all we can fetch multiple data at same time from db only if responses don't depend on each other.
 * -In this example the post and playlist are Parallel fetched 
 * 
 */

async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  //parallel fetching both posts and playlist 
  const [post, { select: editorPosts }] = await Promise.all([
    client.fetch(STARTUPS_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-s-picks",
    }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-xl">{post.description}</p>
      </section>
      <section className="section_container">
        <img
          src={post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2  items-center mb-3"
            >
              <Image
                src={post.author.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-26-medium !text-black-300">
                  {post.author.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{post.category}</p>
          </div>
          <div>
            <h3 className="text-30-bold">Pitch Details</h3>
            {parsedContent ? (
              <article
                className="parse max-w-4xl font-work-sans break-all"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
              />
            ) : (
              <p className="no-result">No details provided</p>
            )}
          </div>
          <hr className="divider" />

          {editorPosts?.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-30-semibold">Editor Picks</p>
              <ul className="mt-7 card_grid-sm">
                {editorPosts.map((post: StartupCardType, i: number) => (
                  <StartupCard key={i} post={post} />
                ))}
              </ul>
            </div>
          )}

          <Suspense fallback={<p>...Loading</p>}>
            <View id={id}></View>
          </Suspense>

        </div>
      </section>
    </>
  );
}
export default page;
