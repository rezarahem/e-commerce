import { auth } from '@/auth';

const Pro = async () => {
  const session = await auth();

  console.log(session);

  return <div>Protected</div>;
};

export default Pro;
