import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { Admin } from "@/models/Admin";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const admin = await Admin.findOne({
          email:    credentials.email,
          isActive: true,
        }).lean();
        if (!admin) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          admin.passwordHash
        );
        if (!valid) return null;
        // Fire-and-forget last login update
        Admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() }).exec();
        return {
          id:    admin._id.toString(),
          name:  admin.name,
          email: admin.email,
          role:  admin.role,
        };
      },
    }),
  ],
});
