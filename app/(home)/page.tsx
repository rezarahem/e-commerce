import { auth } from '@/auth';

const HomePage = async () => {
  const session = await auth();

  return <div>home</div>;
};

export default HomePage;
