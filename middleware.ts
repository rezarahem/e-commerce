import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import {
  DEAFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  adminRoot,
} from '@/routes';
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAdminRoutes = nextUrl.pathname.startsWith(adminRoot);

  if (isApiAuthRoutes) return;

  if (isAuthRoutes) {
    if (isLoggedIn)
      return Response.redirect(new URL(DEAFAULT_LOGIN_REDIRECT, nextUrl));

    return;
  }

  if (!isLoggedIn && !isPublicRoutes)
    return Response.redirect(new URL('/login', nextUrl));

  // if (isAdminRoutes && String(req.auth?.user.role) !== 'ADMIN')
  //   return Response.redirect(new URL('/user', nextUrl));

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
