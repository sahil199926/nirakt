import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Lead }      from "@/models/Lead";
import { z }         from "zod";

const LeadSchema = z.object({
  name:                 z.string().min(2),
  phone:                z.string().min(10).max(15),
  email:                z.string().email().optional().or(z.literal("")),
  source:               z.enum(["contact_form", "cta_banner", "hero_form", "package_enquiry"]),
  destinationType:      z.string().optional(),
  preferredDestination: z.string().optional(),
  travelDate:           z.string().optional(),
  travelers:            z.number().optional(),
  budget:               z.string().optional(),
  message:              z.string().max(1000).optional(),
  packageId:            z.string().optional(),
  packageTitle:         z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    await connectDB();
    const lead = await Lead.create({
      ...parsed.data,
      email:    parsed.data.email || undefined,
      isLockIn: false,
      status:   "new",
    });

    return NextResponse.json({ id: lead._id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
