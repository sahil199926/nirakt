import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Service }   from "@/models/Service";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const services = await Service.find({}, { title: 1, slug: 1, categories: 1 }).lean();

  const categories = services.flatMap((s) =>
    s.categories.map((c: { name: string; slug: string }) => ({
      label:        c.name,
      slug:         c.slug,
      serviceSlug:  s.slug,
      serviceTitle: s.title,
    }))
  );

  return NextResponse.json(categories);
}
