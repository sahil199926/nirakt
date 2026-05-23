import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Package }   from "@/models/Package";
import { Service }   from "@/models/Service";
import { revalidatePaths } from "@/lib/revalidate";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const sp       = req.nextUrl.searchParams;
  const page     = Math.max(1, Number(sp.get("page")  ?? 1));
  const limit    = Math.min(100, Number(sp.get("limit") ?? 20));
  const search   = sp.get("search")   ?? "";
  const category = sp.get("category") ?? "";
  const active   = sp.get("active");

  const filter: Record<string, unknown> = {};
  if (search)              filter.title = { $regex: search, $options: "i" };
  if (category)            filter.categorySlugs = category;
  if (active === "true")   filter.isActive = true;
  if (active === "false")  filter.isActive = false;

  const [packages, total] = await Promise.all([
    Package.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("title slug price duration badge isActive isFeatured coverImage categorySlugs createdAt")
      .lean(),
    Package.countDocuments(filter),
  ]);

  return NextResponse.json({ packages, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  if (!body.slug && body.title) {
    body.slug = slugify(body.title, { lower: true, strict: true });
  }

  // Validate category slugs against services
  if (body.categorySlugs?.length) {
    const services   = await Service.find({}, { "categories.slug": 1 }).lean();
    const validSlugs = new Set(
      services.flatMap((s) => s.categories.map((c: { slug: string }) => c.slug))
    );
    body.categorySlugs = (body.categorySlugs as string[]).filter((s) => validSlugs.has(s));
  }

  const pkg = await Package.create(body);
  await revalidatePaths(["/packages", `/packages/${pkg.slug}`]);

  return NextResponse.json(pkg, { status: 201 });
}
