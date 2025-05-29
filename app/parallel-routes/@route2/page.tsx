import Link from "next/link";

export const dynamic = "force-static";

const RECENT_POSTS_QUERY = `
  query RecentPosts15 {
    recentPosts: allPosts(first: 3, orderBy: _publishedAt_DESC) {
      id
      title
      slug
      _publishedAt
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

      next: {
        revalidate: 5,
      },
      body: JSON.stringify({
        query: RECENT_POSTS_QUERY,
      }),
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

export default async function Route2() {
  const { recentPosts, timestamp } = await getData();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>15 seconds route {timestamp}</div>
      <ul>
        {/* @ts-ignore */}
        {recentPosts?.map(({ id, slug, title, _publishedAt }) => (
          <li key={id}>
            <Link href={`#${slug}`}>{title}</Link>
            {_publishedAt && (
              <>
                <br />
                <small>{new Date(_publishedAt).toDateString()}</small>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
