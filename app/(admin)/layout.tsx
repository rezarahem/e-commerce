import { auth } from '@/auth';
import ControlNavbar from '@/components/control/navbar/control-navbar';
import { redirect } from 'next/navigation';

const ControlLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (session?.user.role.toString() !== 'ADMIN') redirect('/user');

  return (
    <>
      <ControlNavbar />
      {children}
    </>
  );
};

export default ControlLayout;
