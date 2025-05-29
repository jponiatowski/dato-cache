import { revalidateTag } from "next/cache";
import Link from "next/link";

export const dynamic = "force-static";

const RECENT_POSTS_QUERY = `
  query RecentPosts30 {
    recentPosts: allPosts(first: 3, orderBy: _publishedAt_DESC) {
      id
      title
      slug
    }
  }
`;

const getData = async () => {
  try {
    const response = await fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.PUBLIC_DATOCMS_API_TOKEN}`,
      },

      body: JSON.stringify({
        query: RECENT_POSTS_QUERY,
      }),
      next: {
        revalidate: false,
        // tags: ["bejamas"],
      },
    });

    const data = await response.json();

    return {
      recentPosts: data.data.recentPosts,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const revalidateData = async () => {
  "use server";
  revalidateTag("bejamas");
};

export default async function Route1() {
  const { recentPosts, timestamp } = await getData();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <button onClick={revalidateData}>Revalidate</button>
      <div>revalidate: false route {timestamp}</div>
      <ul>
        {/* @ts-ignore */}
        {recentPosts?.map(({ id, slug, title }) => (
          <li key={id}>
            <Link href={`#${slug}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
