import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category, ProductToCategory } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const HomePage = async () => {
  // const catAndProducts = await drizzleDb.query.category.findFirst({
  //   where: eq(category.id, 1),
  //   with: {
  //     productToCategory: {
  //       with: {
  //         category: true,
  //         product: true,
  //       },
  //     },
  //   },
  // });

  return <div>home</div>;
};

export default HomePage;
