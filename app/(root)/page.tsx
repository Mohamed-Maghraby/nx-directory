import StartupCard, { StartupCardType } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";

 /**
  * The root route (/) home. 
  * Any page can access a search params as a prop in server-components, we can define the type of this param ({ query?: string })
  * Props in server-components is a type of Promise.
  * When home page is first rendered no searchParams but when using the search input to search, the url includes this query (?query=string) 
  * next passes this query in the props
  * 
  * SearchForm: when user submit the from (search) SearchForm redirects to the page with the search query, we use this query to fetch 
  * the data and then pass the query to SearchForm to conditionally display a "resetForm" component.
  * 
  * If there is a post we pass it to "StartupCard" component.
  * 
  * Note: sanityFetch keeps updating content when new post is added.
  * 
  * Home Page flow:
  * 
  * (case 1)
  * -Site is requested -> search query = undefined -> post
  * -Home page calls "sanityFetch" with (STARTUPS_QUERY, params). 
  * -STARTUPS_QUERY contains logic to (fetch all post || fetch with search query).
  * -Params is "null" -> STARTUPS_QUERY fetches all posts.
  * -SearchForm is rendered with (query = undenied).
  * -StartupCardType displays the posts
  * 
  * (case 2)
  * -user uses SearchForm to search a post and submit
  * -Form in SearchForm contains action="/", next redirects again to home page but with (searchParams contains query).
  * -sanityFetch is called and now with a query -> STARTUPS_QUERY fetches post based on the search query from user.
  * -All other process are the same.
  * 
  */


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {

  //get query from searchParams
  const query = (await searchParams).query;

  //define a params (will be used to fetch data)
  const params = { search: query || null };

  //using sanityFetch defined in live.ts in lib to fetch posts based on params object above (contains query) & STARTUPS_QUERY from query.ts
  const { data: posts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params: params,
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup Connect with Entrepreneur
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches , and get noticed in virtual
          competitions
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupCardType) => {
              return <StartupCard key={post?._id} post={post}></StartupCard>;
            })
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
