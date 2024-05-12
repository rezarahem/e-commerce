'use server';

import axios from 'axios';

type OtpProps = {
  phone: string;
  userId?: string;
};

export const Otp = async ({
  phone,
  userId,
}: OtpProps): Promise<
  | {
      code: string;
      errorMessage: string;
    }
  | undefined
> => {
  try {
    const res = await axios.post(
      'https://console.melipayamak.com/api/send/otp/715c9ca1b60d4dbeb60277761fbb9d7d',
      {
        to: phone,
      },
    );

    let errorMessage: string = '';
    const { data, status, statusText } = res;
    const code = data.code;
    if (!statusText || statusText !== 'ok')
      errorMessage: 'خطا در ارسال کد تایید، مجددا تلاش کنید';

    return {
      code,
      errorMessage,
    };
  } catch (error) {
    console.log('[Otp]', error);
  }
};
