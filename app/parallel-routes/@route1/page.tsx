import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 30;

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
      // next: {
      //   revalidate: 30,
      //   tags: ["cache-30"],
      // },
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

export default async function Route1() {
  const { recentPosts, timestamp } = await getData();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>30 seconds route {timestamp}</div>
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
