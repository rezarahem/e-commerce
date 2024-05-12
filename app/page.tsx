import { auth } from '@/auth';

const HomePage = async () => {
  const session = await auth();

  console.log(session?.user);

  return <div>HomePage</div>;
};

export default HomePage;
