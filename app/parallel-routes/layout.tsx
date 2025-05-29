export default function Layout({
  children,
  route1,
  route2,
}: {
  children: React.ReactNode;
  route1: React.ReactNode;
  route2: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>{route1}</div>
      <div>{route2}</div>
      <div>{children}</div>
    </div>
  );
}
