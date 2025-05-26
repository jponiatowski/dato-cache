"use client";

import { CacheTag } from "@/lib/cache-tags";

export default function InvalidateButton({
  cacheTags,
}: {
  cacheTags: CacheTag[];
}) {
  const handleClick = async () => {
    await fetch("/api/invalidate-cache-tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Webhook-Token": process.env.NEXT_PUBLIC_WEBHOOK_TOKEN || "",
      },
      body: JSON.stringify({
        entity_type: "cda_cache_tags",
        event_type: "invalidate",
        entity: {
          id: "cda_cache_tags",
          type: "cda_cache_tags",
          attributes: {
            // The array of DatoCMS Cache Tags that need to be invalidated
            tags: cacheTags,
          },
        },
      }),
    });
  };

  return (
    <button style={{ fontSize: "30px", color: "red" }} onClick={handleClick}>
      Invalidate all
    </button>
  );
}
