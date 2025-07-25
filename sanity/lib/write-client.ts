/**
 * Define a client to connect with db (sanity). Defines clients for only sever-component, we do this by using "server-only" external lib
 * We should use this writeClient method in server components only cause it includes the token
 */

import "server-only"

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token,
})

if (!writeClient.config().token) {
    throw new Error("Write token not found")
}