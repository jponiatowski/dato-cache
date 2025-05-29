/*
 * The purpose of this module is to manage inside of a Turso database the
 * associations between the GraphQL queries made to the DatoCMS Content Delivery
 * API, and the `Cache-Tags` that these requests return.
 *
 * To store these associations, we use a simple table `query_cache_tags`
 * composed of just two columns:
 *
 * - `query_id` (TEXT): A unique identifier for the query, used to tag the request;
 * - `cache_tag` (TEXT): An actual cache tag returned by the query.
 *
 * These associations will allow us to selectively invalidate individual GraphQL
 * queries, when we receive a "Cache Tags Invalidation" webhook from DatoCMS.
 */

import { createClient } from "@libsql/client";

import type { CacheTag } from "./cache-tags";

/*
 * Creates and returns a Turso database client. Note the custom fetch method
 * provided to the Turso client. By setting the `cache` option to `no-store`, we
 * ensure that Next.js does not cache our HTTP requests for database calls.
 */
const database = () =>
  createClient({
    // syncUrl: process.env.TURSO_DATABASE_URL,
    // url: process.env.TURSO_DATABASE_URL!,
    // authToken: process.env.TURSO_AUTH_TOKEN!,
    url: "file:local.db",
    fetch: (input: string | URL, init?: RequestInit) => {
      return fetch(input, { ...init });
    },
  });

/*
 * Generates a string of SQL placeholders ('?') separated by commas.
 * It's useful for constructing SQL queries with varying numbers of parameters.
 */
function sqlPlaceholders(count: number) {
  return Array.from({ length: count }, () => "?").join(",");
}

/*
 * Associates DatoCMS Cache Tags to a given GraphQL query. Within an implicit
 * transaction, it initially removes any existing tags for the given queryId,
 * and then adds the new ones. In case of a conflict (e.g. trying to insert a
 * duplicate entry), the operation simply does nothing.
 */
export async function storeQueryCacheTags(
  queryId: string,
  cacheTags: CacheTag[]
) {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.warn("TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set");
    return;
  }

  // Early return if no cache tags provided
  if (!cacheTags || cacheTags.length === 0) {
    return;
  }

  //   await database().execute({
  //     sql: `CREATE TABLE IF NOT EXISTS query_cache_tags (
  //   query_id TEXT NOT NULL,
  //   cache_tag TEXT NOT NULL,
  //   PRIMARY KEY (query_id, cache_tag)
  // )`,
  //     args: [],
  //   });

  try {
    await database().execute({
      sql: `
      INSERT INTO query_cache_tags (query_id, cache_tag)
      VALUES ${cacheTags.map(() => "(?, ?)").join(", ")}
      ON CONFLICT(query_id, cache_tag) DO NOTHING
    `,
      args: cacheTags.flatMap((cacheTag) => [queryId, cacheTag]),
    });
  } catch (error) {
    // Log the error but don't throw it to prevent frontend from breaking
    // console.error("Error storing cache tags:", error);
  }
}

/*
 * Retrieves the query hashs associated with specified cache tags.
 */
export async function queriesReferencingCacheTags(
  cacheTags: CacheTag[]
): Promise<string[]> {
  // Early return if no cache tags provided

  try {
    const { rows } = await database().execute({
      sql: `
      SELECT DISTINCT query_id
      FROM query_cache_tags
      WHERE cache_tag IN (${sqlPlaceholders(cacheTags.length)})
      `,
      args: cacheTags,
    });
    return rows.map((row) => row.query_id as string);
  } catch (error) {
    // console.error("Error retrieving queries referencing cache tags:", error);
    return [];
  }
}

/*
 * Removes all entries that reference the specified queries.
 */
export async function deleteQueries(queryIds: string[]) {
  try {
    await database().execute({
      sql: `
      DELETE FROM query_cache_tags
      WHERE query_id IN (${sqlPlaceholders(queryIds.length)})
    `,
      args: queryIds,
    });
  } catch (error) {
    // console.error("Error deleting queries:", error);
  }
}

/*
 * Wipes out all data contained in the table.
 */
export async function truncateAssociationsTable() {
  try {
    await database().execute("DELETE FROM query_cache_tags");
  } catch (error) {
    // console.error("Error truncating associations table:", error);
  }
}
