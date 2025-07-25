import { client } from "@/sanity/lib/client";
import Ping from "./Ping";
import { STARTUPS_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after} from "next/server";

/**
 * Accepts an id from startup -> [id] ->  root page.
 * Fetches views by startup id from db.
 * Calls writeClient to update view in db.
 * 
 */

async function View({ id }: { id: string }) {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUPS_VIEWS_QUERY, { id });

    // TODO: Update umber of views when changes
     after(async ()=> {
        await writeClient
            .patch(id)
            .set({views: totalViews + 1})
            .commit()
     })

        
  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
}
export default View;
