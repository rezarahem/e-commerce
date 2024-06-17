import ProductForm from '@/components/control/product/product-form';
import Container from '@/components/ui/container';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Product } from '@/drizzle/schema';
import { ProductFeatureSchema } from '@/zod';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import * as z from 'zod';

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

  const product = await drizzleDb.query.Product.findFirst({
    where: eq(Product.id, +params.id[0]),
    with: {
      productFeatures: {
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

  // type l = {
  //   groupName?: string | undefined;
  //   pairs: { featureKey: string; featureValue: string }[];
  // }[];

  const productImages = product?.images.map((image) => ({
    id: image.id,
    url: image.url,
  }));

  const productFeatures: z.infer<typeof ProductFeatureSchema>[] | undefined =
    product?.productFeatures.map((f) => ({
      featureId: f.featureId,
      featureName: f.featureName ?? '',
      pairs: f.productFeaturePairs.map((p) => ({
        pairId: p.pairId,
        pairKey: p.pairKey,
        pairValue: p.pairValue,
      })),
    }));

  const relatedCategoriesId = product?.productToCategory.map(({ category }) => {
    return {
      id: category.id,
    };
  });

  const allCategories = await drizzleDb.query.Category.findMany();

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
