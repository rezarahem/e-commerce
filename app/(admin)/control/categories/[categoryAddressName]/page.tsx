import CategoryForm from '@/components/control/category/category-form';
import Container from '@/components/ui/container';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category as schemaCategory } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

const CategoryFormPage = async ({
  params,
}: {
  params: {
    categoryAddressName: string;
  };
}) => {
  const category = await drizzleDb.query.category.findFirst({
    where: eq(schemaCategory.categoryAddressName, params.categoryAddressName),
  });

  const allCategories = await drizzleDb.query.category.findMany();
  return (
    <Container defualtPY className='space-y-3'>
      <CategoryForm category={category} allCategories={allCategories} />
    </Container>
  );
};

export default CategoryFormPage;
