'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { eq } from 'drizzle-orm';
import { Otp } from '../otp';

export const CheckUserPhoneNumberAction = async (
  phoneNumber: string,
): Promise<
  | {
      success: boolean;
      code: string;
      errorMessage: string;
    }
  | undefined
> => {
  try {
    const user = await drizzleDb.query.Users.findFirst({
      where: (users, { eq }) => eq(users.phone, phoneNumber),
    });

    if (user) {
      const otp = await Otp({ phone: phoneNumber });

      if (otp?.errorMessage)
        return {
          success: false,
          code: '',
          errorMessage: otp.errorMessage,
        };

      if (!otp?.errorMessage && otp?.code)
        return {
          success: true,
          code: otp.code,
          errorMessage: '',
        };
    }

    return {
      success: false,
      code: '',
      errorMessage: '',
    };
  } catch (error) {
    console.log('[CheckUserPhoneNumberAction]', error);
  }
};
