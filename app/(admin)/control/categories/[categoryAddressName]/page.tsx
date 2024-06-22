import { GetAllCategoriesExceptThisParentAndSubsAction } from '@/action/control/category/get-all-categories-except-this-parent-and-subs-action';
import CategoryForm from '@/components/control/category/category-form';
import Container from '@/components/ui/container';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const CategoryFormPage = async ({
  params,
}: {
  params: {
    categoryAddressName: string;
  };
}) => {
  const category = await drizzleDb.query.Category.findFirst({
    where: eq(Category.categoryAddressName, params.categoryAddressName),
  });

  let allCategoriesExceptParentTreeOrAllCategories: (typeof Category.$inferSelect)[];

  const result = await GetAllCategoriesExceptThisParentAndSubsAction(
    category?.id as number,
  );

  if (
    !result ||
    !result.success ||
    !result.flatParentCatAndSubs ||
    result.flatParentCatAndSubs.length === 0
  ) {
    allCategoriesExceptParentTreeOrAllCategories =
      await drizzleDb.query.Category.findMany();
  } else {
    allCategoriesExceptParentTreeOrAllCategories = result.flatParentCatAndSubs;
  }

  const allCategories = await drizzleDb.query.Category.findMany();

  return (
    <Container defualtPY className='space-y-3'>
      <CategoryForm
        category={category}
        allCategories={allCategories}
        allCategoriesExceptParentTreeOrAllCategories={
          allCategoriesExceptParentTreeOrAllCategories
        }
      />
    </Container>
  );
};

export default CategoryFormPage;
