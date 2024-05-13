'use server';

import { signOut } from '@/auth';
import { DEAFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const LogoutAction = async () => {
  try {
    await signOut({
      redirectTo: DEAFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { errorMessage: 'Invalid credentials' };

        default:
          return { errorMessage: 'Something went wrong' };
      }
    }
    console.log('[LogoutAction]', error);
    throw error;
  }
};
