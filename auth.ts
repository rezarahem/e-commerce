import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { Users, userRole } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import Credentials from 'next-auth/providers/credentials';
import { drizzleDb } from './drizzle/drizzle-db';
import { LoginSchema } from './zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(drizzleDb),
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials) return null;

        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { phone } = validatedFields.data;

          const user = await drizzleDb.query.users.findFirst({
            where: (users, { eq }) => eq(users.phone, phone),
          });

          if (!user) return null;

          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const [existingUser] = await drizzleDb
        .select()
        .from(Users)
        .where(eq(Users.id, token.sub));

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
    // updateAge: 0,
  },
  pages: {
    signIn: '/login',
  },
});
