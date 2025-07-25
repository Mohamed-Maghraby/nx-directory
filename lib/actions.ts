"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * Use "use server" directive to define an action
 * Those action's can be used in next "form" to post data
 * This what's called a server action, allowing us to mutate data (post, update) from server or client.
 * This function creates a post from the client.
 * it takes the form data object and a pitch (markdown as string)
 */

export async function createPitch(state: any, form: FormData, pitch: string) {
  //get session form next-auth
  const session = await auth();

  //if no session return an error
  if (!session)
    return parseServerActionResponse({
      error: "Not Signed in",
      status: "ERROR",
    });

  //creates an array from the fromEntries to filter the (markdown), creates an object from the form, then destructure it
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== pitch)
  );

  //create a slug for the post using "slugify" lib
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    //define post's scheme
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    //post to sanity to database
    const result = await writeClient.create({ _type: "startup", ...startup });

    //using parseServerActionResponse from utility we parse the action response for the prober format
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });

  } catch (error) {
    console.log(error);
    parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
}
