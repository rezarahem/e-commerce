import { auth } from '@/auth';
import LoginForm from '@/components/login/login-form';
import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const session = await auth();

  if (session?.user.id) redirect('/');

  return (
    <div className='flex h-dvh items-center justify-center'>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
