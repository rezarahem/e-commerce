'use client';

import { toEnglishNumber, toPersianNumber } from '@/libs/persian-string';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/libs/utils';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCountdown } from 'usehooks-ts';
import Link from 'next/link';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [userVerificationCode, setUserVerificationCode] = useState('');
  const [serverVerificationCode, setServerVerificationCode] = useState('');
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 120,
      intervalMs: 1000,
    });

  // Login Logics
  const checkUserPhoneNumber = async () => {
    setLoading(true);
    try {
      if (!userPhoneNumber) {
        toast.error('لطفا شماره تماس خود را وارد کنید');
        return;
      }

      const result = await CheckUserPhoneNumberAction(
        toEnglishNumber(userPhoneNumber),
      );

      if (!result) {
        toast.error('خطایی رخ داد، مجدد تلاش کنید');
      }

      if (result?.success && result?.code && !result.errorMessage) {
        setPhase(3);
        toast.success('کد تایید ارسال شد');
        startCountdown();
        setServerVerificationCode(result.code as string);
      }

      if (result?.errorMessage && !result?.success && !result.code) {
        toast.error(result?.errorMessage);
      }

      if (!result?.success && !result?.errorMessage && !result?.code) {
        setPhase(2);
        toast('شما هنوز ثبت نام نکرده‌اید');
      }
    } catch (error) {
      toast.error('خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const craeteUser = async () => {
    setLoading(true);
    try {
      if (phase === 2 && userPhoneNumber && userName) {
        const result = await CreateUserAction(
          userName,
          toEnglishNumber(userPhoneNumber),
        );

        if (!result) {
          toast.error('خطایی رخ داد، مجدد تلاش کنید');
        }

        if (result?.success && result?.code && !result.errorMessage) {
          setPhase(3);
          toast.success('کد تایید ارسال شد');
          setServerVerificationCode(result.code as string);
          startCountdown();
        }

        if (result?.errorMessage && !result?.success && !result.code) {
          toast.error(result?.errorMessage);
        }

        if (!result?.success && !result?.errorMessage && !result?.code) {
          toast.error('خطایی رخ داد، دوباره تلاش کنید');
        }
        ////////////////////////////////
        //////////////////////////////
        /////////////////
      } else {
        toast.error('خطایی رخ داد');
      }
    } catch (error) {
      toast.error('خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      const phoneNumber = toEnglishNumber(userPhoneNumber);
      const verification =
        serverVerificationCode === toEnglishNumber(userVerificationCode);

      if (!verification) {
        toast.error('کد وارد شده صحیح نمی‌باشد');
        return;
      }

      await signIn('credentials', {
        phoneNumber,
        callbackUrl: '/',
      });
      toast.success('شما با موفقیت وارد شدید');
    } catch (error) {
      toast.error('خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    try {
      const result = await Otp({ phone: userPhoneNumber });

      if (result?.errorMessage) {
        toast.error(result?.errorMessage);
      }

      if (result?.code) {
        toast.success('کد تایید ارسال شد');
        setServerVerificationCode(result.code);
        resetCountdown();
        startCountdown();
      }
    } catch (error) {
      toast.error('خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  const inputStyleString = 'border rounded-md p-2 text-sm shadow-sm';
  const buttonStyleString =
    'bg-black text-white p-2 rounded-md hover:bg-zinc-800 disabled:bg-gray-500 disabled:hover:cursor-not-allowed flex items-center justify-center gap-x-2 shadow-sm';

  const userPhoneInput = (
    <>
      <label htmlFor='phoneNumber' className='text-slate-950'>
        شماره تماس
      </label>
      <input
        onChange={(e) => {
          e.preventDefault();
          setUserPhoneNumber(toPersianNumber(e.target.value));
        }}
        value={userPhoneNumber}
        name='phoneNumber'
        placeholder='####  ###  ## ۰۹'
        type='text'
        className={cn(inputStyleString)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          checkUserPhoneNumber();
        }}
        disabled={loading}
        className={cn(buttonStyleString)}
      >
        ورود
        {loading && <Loader2 className='h-5 w-5 animate-spin' />}
      </button>
    </>
  );
  const userNameInput = (
    <>
      <label htmlFor='userName' className='text-slate-950'>
        نام و نام‌خانوادگی
      </label>
      <input
        onChange={(e) => {
          e.preventDefault();
          setUserName(e.target.value);
        }}
        value={userName}
        name='userName'
        placeholder='نام و نام‌خانوادگی'
        type='text'
        className={cn(inputStyleString)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          craeteUser();
        }}
        disabled={loading}
        className={cn(buttonStyleString)}
        // formAction={CraeteUser}
      >
        ثبت‌نام
        {loading && <Loader2 className='h-5 w-5 animate-spin' />}
      </button>
    </>
  );
  const verificationInput = (
    <>
      <label htmlFor='verificationCode' className='text-slate-950'>
        کد تایید
      </label>
      <div className='flex items-center justify-between gap-x-2'>
        <input
          value={userVerificationCode}
          onChange={(e) => {
            e.preventDefault();
            setUserVerificationCode(toPersianNumber(e.target.value));
          }}
          name='verificationCode'
          placeholder='# # # # #'
          type='text'
          className={cn(inputStyleString, 'w-full')}
        />
        <span
          className={cn(
            inputStyleString,
            'flex w-16 items-center justify-center',
          )}
        >
          {toPersianNumber(String(count))}
        </span>
      </div>
      <button
        onClick={async (e) => {
          e.preventDefault();
          if (count < 1) {
            resendOtp();
          } else {
            submit();
          }
        }}
        disabled={loading}
        className={cn(buttonStyleString)}
      >
        {count < 1 ? 'ارسال مجدد' : 'ثبت'}
        {loading && <Loader2 className='h-5 w-5 animate-spin' />}
      </button>
    </>
  );

  let loginInputs = <div></div>;

  switch (phase) {
    case 1:
      loginInputs = userPhoneInput;
      break;
    case 2:
      loginInputs = userNameInput;
      break;
    case 3:
      loginInputs = verificationInput;
      break;
    default:
      loginInputs = userPhoneInput;
      break;
  }

  return (
    <div className='w-full px-5'>
      <div className='mx-auto space-y-7 md:w-[502px]'>
        <div className='mb-12 flex items-center justify-between'>
          <Link href='/' className='rounded-md p-2 hover:bg-slate-500/15'>
            <ArrowLeft />
          </Link>
        </div>
        <div>
          <div className='text-2xl font-bold text-slate-950'>
            ورود / ثبت‌نام
          </div>
          <p className='mt-1 text-sm text-gray-400'>
            برای ورود شماره تماس خود را وارد کنید.
          </p>
        </div>
        <div className='flex flex-col gap-y-3'>{loginInputs}</div>
      </div>
    </div>
  );
};

export default LoginForm;
