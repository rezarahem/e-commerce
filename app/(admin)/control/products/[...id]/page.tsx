import ProductForm from '@/components/control/product/product-form';
import Container from '@/components/ui/container';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { product as productSchema } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { TypeOf } from 'zod';

const ProuductFormPage = async ({
  params,
}: {
  params: {
    id: string[];
  };
}) => {
  if (params.id.length > 2) notFound();

  // check if the first param is number (still string but number string)
  const checkIfTheRightParamsWerePassesd =
    /[a-zA-Zآابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]/.test(params.id[0]);
  // if it is throw not found
  if (checkIfTheRightParamsWerePassesd) notFound();

  const product = await drizzleDb.query.product.findFirst({
    where: eq(productSchema.id, +params.id[0]),
    with: {
      productFeatureGroup: {
        with: {
          productFeaturePairs: true,
        },
      },
      images: true,
      productToCategory: {
        with: {
          category: true,
        },
      },
    },
  });

  const productImages = product?.images.map((image) => image.url);

  const productFeatures = product?.productFeatureGroup;

  const relatedCategoriesId = product?.productToCategory.map(({ category }) => {
    return {
      id: category.id,
    };
  });

  const allCategories = await drizzleDb.query.category.findMany();

  return (
    <Container defualtPY className='space-y-3'>
      <ProductForm
        product={product}
        productImages={productImages}
        productFeatures={productFeatures}
        relatedCategoriesId={relatedCategoriesId}
        allCategories={allCategories}
      />
    </Container>
  );
};

export default ProuductFormPage;
