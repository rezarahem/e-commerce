import { GetAllProductsFromCategoryTreeAction } from '@/action/search/get-all-products-from-category-tree-action';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const AllProducts = async ({
  params,
}: {
  params: {
    categoryAddressNameArray: string[];
  };
}) => {
  const currentCategoryAddressName = params.categoryAddressNameArray
    ? params.categoryAddressNameArray[
        params.categoryAddressNameArray?.length - 1
      ]
    : -1;

  const [currentCategory] =
    currentCategoryAddressName === -1
      ? []
      : await drizzleDb
          .select()
          .from(Category)
          .where(eq(Category.categoryAddressName, currentCategoryAddressName));

  const initailProducts = await GetAllProductsFromCategoryTreeAction(
    currentCategory.id,
  );

  console.log(initailProducts);

  return (
    <div className='mt-2 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-8'>
      <div className='p-2 lg:col-span-2'></div>
    </div>
  );
};

export default AllProducts;
