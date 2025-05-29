"use client";

export default function RevalidateButton() {
  const handleRevalidate = async () => {
    await fetch("/api/revalidate-path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: "/test-api" }),
    });
  };
  return <button onClick={handleRevalidate}>Revalidate</button>;
}
