import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const ControlLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (session?.user.role.toString() !== 'ADMIN') redirect('/user');

  return <>{children}</>;
};

export default ControlLayout;
