import { auth }     from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Service }   from "@/models/Service";
import { MAX_FEATURED_HOME_SERVICES } from "@/lib/limits";
import { revalidatePaths } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const services = await Service.find().sort({ title: 1 }).lean();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body    = await req.json();
  await connectDB();

  if (body.isFeaturedHome) {
    const featuredCount = await Service.countDocuments({ isFeaturedHome: true });
    if (featuredCount >= MAX_FEATURED_HOME_SERVICES) {
      return NextResponse.json(
        {
          error: `You can feature at most ${MAX_FEATURED_HOME_SERVICES} services on the home page. Unfeature another service first.`,
        },
        { status: 400 }
      );
    }
  }

  const service = await Service.create(body);

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath(`/services/${service.slug}`);
  await revalidatePaths(["/", "/services", `/services/${service.slug}`]);

  return NextResponse.json(service, { status: 201 });
}
