'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Otp } from '../otp';
import { users } from '@/drizzle/schema';

export const CreateUserAction = async (
  userName: string,
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
    // const user = await prismadb.user.upsert({
    //   where: {
    //     phoneNumber,
    //   },
    //   update: {},
    //   create: {
    //     phoneNumber,
    //     name: userName,
    //   },
    // });

    const [user] = await drizzleDb
      .insert(users)
      .values({
        phone: phoneNumber,
        name: userName,
      })
      .returning()
      .onConflictDoNothing();

    const otp = await Otp({ phone: phoneNumber, userId: user.id });

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

    return {
      code: '',
      errorMessage: '',
      success: false,
    };
  } catch (error) {
    console.log('[CreateUserAction]', error);
  }
};
