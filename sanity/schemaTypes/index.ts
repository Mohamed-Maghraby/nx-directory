import { type SchemaTypeDefinition } from 'sanity'
import { author } from './author'
import { startup } from './startup'
import { playlist } from './playlist'

/**
 * In ths folder we create schemas for author, startup, playlist each in a separate file.
 * The schema is the structure of the database columns with the type of each column (same in MySQL).
 * After defining schemas we export them from here ->
 */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist],
}
