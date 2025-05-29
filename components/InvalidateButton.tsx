"use client";

import { CacheTag } from "@/lib/cache-tags";

export default function InvalidateButton({
  cacheTags,
}: {
  cacheTags: CacheTag[];
}) {
  const handleClick = async () => {
    try {
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
              tags: cacheTags,
            },
          },
        }),
      });

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
              tags: cacheTags,
            },
          },
        }),
      });

      window?.alert("Tags invalidated successfully");
    } catch (error) {
      console.error(error);
      window?.alert("Failed to invalidate tags");
    }
  };

  return (
    <button
      style={{ fontSize: "20px", color: "white", width: "fit-content" }}
      onClick={handleClick}
    >
      Invalidate tags
    </button>
  );
}
