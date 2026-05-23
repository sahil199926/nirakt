import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
    };
  }
  interface User {
    role: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: "/admin/login",
    error:  "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn  = !!auth?.user;
      const { pathname } = nextUrl;

      const isLoginPage  = pathname === "/admin/login";
      const isAdminRoute = pathname.startsWith("/admin");
      const isAdminApi   = pathname.startsWith("/api/admin");

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin/dashboard", nextUrl));
        return true;
      }

      if (isAdminRoute || isAdminApi) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id   = token.id   as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
};
