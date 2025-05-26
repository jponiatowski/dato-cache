import Link from "next/link";

import { executeQuery } from "@/lib/fetch-content";
import { graphql } from "@/lib/graphql";
import InvalidateButton from "@/components/InvalidateButton";

const RECENT_POSTS_QUERY = graphql(`
  query RecentPosts {
    recentPosts: allPosts(first: 3, orderBy: _publishedAt_DESC) {
      id
      title
      slug
      _publishedAt
    }
  }
`);

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, cacheTags } = await executeQuery(RECENT_POSTS_QUERY);
  console.log("cacheTags", cacheTags);
  const { recentPosts } = data;

  return (
    <>
      <InvalidateButton cacheTags={cacheTags} />
      <hgroup>
        <p>
          <small>
            <mark>Homepage</mark>
          </small>
        </p>
        <h1>Recently published</h1>
        <p>
          This page executes a query to fetch and show the 3 most recent posts.
        </p>
      </hgroup>

      <ul>
        {recentPosts.map(({ id, slug, title, _publishedAt }) => (
          <li key={id}>
            <Link href={`/posts/${slug}`}>{title}</Link>
            {_publishedAt && (
              <>
                <br />
                <small>{new Date(_publishedAt).toDateString()}</small>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
