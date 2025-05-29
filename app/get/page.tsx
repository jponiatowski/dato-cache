import Link from "next/link";
export const dynamic = "force-dynamic";

const RECENT_POSTS_QUERY = `
  query RecentPosts {
    recentPosts: allPosts(first: 3, orderBy: _publishedAt_DESC) {
      id
      title
      slug
      _publishedAt
    }
  }
`;

const cacheSettings = {
  next: {
    revalidate: 10,
  },
};

const getData = async () => {
  try {
    const get = await fetch("https://swapi.info/api/films", {
      method: "GET",
      ...cacheSettings,
    });

    console.log("x-vercel-cache", get.headers.get("x-vercel-cache"));
    console.log("cache-control", get.headers.get("cache-control"));
    console.log("cf-cache-status", get.headers.get("cf-cache-status"));
    const data = await get.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default async function Home() {
  const fetchStartTime = Date.now();
  const recentPosts = await getData();
  const fetchEndTime = Date.now();
  const fetchDuration = fetchEndTime - fetchStartTime;

  // const { data, cacheTags, cacheStatus } = await executeQuery(
  //   RECENT_POSTS_QUERY
  // );
  // const { recentPosts } = data;
  // const recentPosts: any[] = [];
  const cacheStatus = `Fetch took ${fetchDuration}ms`;

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          marginBottom: "1rem",
        }}
      >
        <h1>Cache Settings</h1>
        <pre style={{ color: "white" }}>
          {JSON.stringify(cacheSettings, null, 2)}
        </pre>
        <div style={{ fontSize: "1rem", color: "lightgray" }}>
          Page rendered at: {new Date().toISOString()}
        </div>
        {/* <InvalidateButton cacheTags={cacheTags} /> */}
      </div>
      <hgroup>
        <h1>Recently published</h1>
        <p>
          This page executes a query to fetch and show the 3 most recent posts.
        </p>
      </hgroup>

      <ul>
        {/* @ts-ignore */}
        {recentPosts?.map(({ url, title }) => (
          <li key={title}>
            <Link href={`#${url}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
