import KeycloakProvider from "next-auth/providers/keycloak";
import { prisma } from "@lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session, DefaultSession } from "next-auth";
import { NextAuthOptions } from "next-auth";

type UserRole =
  | "CONTRACT_MANAGER"
  | "CONTRACT_OWNER"
  | "CATEGORY_SOURCING_MANAGER"
  | "LEGAL_TEAM";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: `https://faces-img.xcdn.link/thumb-lorem-face-6312_thumb.jpg`,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Get user from database to get their role
        const dbUser = await prisma.user.findUnique({
          where: { keycloakId: user.id },
        });

        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // optional: customize redirect after signOut
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
