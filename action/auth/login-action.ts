'use server';

import { signIn } from '@/auth';
import { DEAFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import * as z from 'zod';

export const LoginAction = async (valuus: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(valuus);

  if (!validatedFields.success) {
    return { errorMessage: 'Invalid fields' };
  }

  const { phone } = validatedFields.data;

  try {
    await signIn('credentials', {
      phone,
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
    console.log('[LoginAction]', error);
    throw error;
  }
};
