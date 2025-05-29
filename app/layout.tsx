import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

// export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "DatoCMS starter: a blog example",
  description: "Featuring DatoCMS React components, cache tags and more",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
      </head>
      <body>
        <header className="container">
          <nav>
            <ul>
              <li>
                <strong>DatoCMS starter: a blog example</strong>
              </li>
            </ul>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="container">
          <hr />
          <p>
            This page has been generated on{" "}
            <span
              data-tooltip="This date is injected when the page is built: it won't change anymore, until some of the content changes and all the page is invalidated and, therefore, it will be rebuilt at the first request."
              data-placement="top"
              data-flexible-content
            >
              {new Date().toISOString()}
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}
