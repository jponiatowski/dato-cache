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

const getData = async () => {
  try {
    console.log(`🚀 Making fetch request at: ${new Date().toISOString()}`);

    const response = await fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.PUBLIC_DATOCMS_API_TOKEN}`,
      },
      next: {
        revalidate: 60, // Cache for 60 seconds
      },
      body: JSON.stringify({
        query: RECENT_POSTS_QUERY,
      }),
    });

    console.log({
      timestamp: new Date().toISOString(),
      status: response.status,
      cacheControl: response.headers.get("cache-control"),
      age: response.headers.get("age"),
      xCache: response.headers.get("x-cache"),
      cfCacheStatus: response.headers.get("cf-cache-status"),
    });

    const data = await response.json();
    console.log(`✅ Data received at: ${new Date().toISOString()}`);

    return data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default async function Home() {
  const fetchStartTime = Date.now();
  const { recentPosts } = await getData();
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
        <div style={{ fontSize: "1.5rem", color: "white" }}>
          Cache Status: {cacheStatus}
        </div>
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
    </>
  );
}
