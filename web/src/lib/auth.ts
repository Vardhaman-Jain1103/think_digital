import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GitHub({
      profile(profile) {
        // Use GitHub login as stable username by default
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      if (!user || !account || account.provider !== "github") return false;

      const githubId = account.providerAccountId;
      const username =
        (user as any).username ??
        (profile && "login" in profile ? (profile.login as string) : undefined);

      if (!githubId || !username) return false;

      const dbUser = await prisma.user.upsert({
        where: { githubId },
        create: {
          githubId,
          username,
          name: user.name ?? null,
          avatarUrl: user.image ?? null,
        },
        update: {
          username,
          name: user.name ?? null,
          avatarUrl: user.image ?? null,
        },
      });

      return true;
    },
    async jwt({ token, account }) {
      // On initial sign-in, look up the user by GitHub ID stored in `sub`
      if (account?.provider === "github" && token.sub) {
        const githubId = account.providerAccountId;
        const dbUser = await prisma.user.findUnique({
          where: { githubId },
        });

        if (dbUser) {
          token.userId = dbUser.id;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId && token.username) {
        session.user.id = token.userId as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});

