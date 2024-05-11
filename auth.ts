import { drizzleDb } from '@/drizzle/drizzle-db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { users, userRole } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const { handlers, auth } = NextAuth({
  adapter: DrizzleAdapter(drizzleDb),
  ...authConfig,
  providers: [
    Google,
    Credentials({
      name: 'credentials',
      credentials: {
        phone: {
          label: 'phone',
          type: 'text',
        },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;

        const user = await drizzleDb.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.phone, credentials.phone as string),
        });

        if (!user) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const [existingUser] = await drizzleDb
        .select()
        .from(users)
        .where(eq(users.id, token.sub));

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as typeof userRole;
      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
});
