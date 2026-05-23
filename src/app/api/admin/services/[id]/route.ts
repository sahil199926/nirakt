import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Service }   from "@/models/Service";
import { Package }   from "@/models/Package";
import { revalidatePaths } from "@/lib/revalidate";
import { NextRequest, NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const service = await Service.findById(id).lean();
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(service);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body   = await req.json();
  await connectDB();

  const existing = await Service.findById(id).lean();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If category slugs changed, update referencing packages
  if (body.categories) {
    const oldSlugs = new Map(
      existing.categories.map((c: { slug: string }, i: number) => [i, c.slug])
    );
    for (const [idx, newCat] of body.categories.entries()) {
      const oldSlug = oldSlugs.get(idx);
      if (oldSlug && oldSlug !== newCat.slug) {
        await Package.updateMany(
          { categorySlugs: oldSlug },
          { $set: { "categorySlugs.$[el]": newCat.slug } },
          { arrayFilters: [{ "el": oldSlug }] }
        );
      }
    }
  }

  const service = await Service.findByIdAndUpdate(id, { $set: body }, { new: true });
  await revalidatePaths([`/services/${service?.slug}`]);
  return NextResponse.json(service);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  const service = await Service.findByIdAndDelete(id);
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
