export async function revalidatePaths(paths: string[]) {
  const base   = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) return;

  await Promise.allSettled(
    paths.map((path) =>
      fetch(
        `${base}/api/revalidate?path=${encodeURIComponent(path)}&secret=${secret}`,
        { cache: "no-store" }
      )
    )
  );
}
