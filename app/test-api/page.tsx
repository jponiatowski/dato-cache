import RevalidateButton from "@/components/revalidate-button";
import { revalidatePath } from "next/cache";
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
  // cache: "no-store",
  next: {
    revalidate: 10,
  },
};

const getData = async (tag?: string) => {
  try {
    // console.log(`🚀 Making fetch request at: ${new Date().toISOString()}`);

    // @ts-ignore
    const response = await fetch(
      "https://test-api-indol-seven.vercel.app/post",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.PUBLIC_DATOCMS_API_TOKEN}`,
        },
        ...cacheSettings,
        body: JSON.stringify({
          query: RECENT_POSTS_QUERY,
        }),
      }
    );
    console.log("x-vercel-cache", response.headers.get("x-vercel-cache"));
    console.log("cache-control", response.headers.get("cache-control"));
    console.log("cf-cache-status", response.headers.get("cf-cache-status"));

    const data = await response.json();
    // console.log(`✅ Data received at: ${new Date().toISOString()}`);
    // console.log(data);
    return data.timestamp;
    // return { recentPosts: data?.data?.recentPosts || [], cacheSettings };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { tag } = searchParams;
  const timestamp = await getData(tag as string);
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
        <h2>Response generated on the server at {timestamp}</h2>
        <RevalidateButton />
      </div>
      {/* <hgroup>
        <h1>Recently published</h1>
        <p>
          This page executes a query to fetch and show the 3 most recent posts.
        </p>
      </hgroup> */}

      {/* <ul>
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
      </ul> */}
    </>
  );
}
