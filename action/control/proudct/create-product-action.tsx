'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import {
  ProductImages,
  Product,
  ProductFeatures,
  ProductFeaturePairs,
  ProductToCategory,
} from '@/drizzle/schema';
import { ProductFormSchema } from '@/schemas';
import * as z from 'zod';

type ProductTypeForDbInsert = typeof Product.$inferInsert;
type ProductToCategoryTypeForDbInsert = typeof ProductToCategory.$inferInsert;
type ProductImagesTypeForDbInsert = typeof ProductImages.$inferInsert;
type ProductFeaturesTypeForDbInsert = typeof ProductFeatures.$inferInsert;
type ProductFeaturesPairsTypeForDbInsert =
  typeof ProductFeaturePairs.$inferInsert;

export const CreateProductAction = async (
  data: z.infer<typeof ProductFormSchema>,
) => {
  const validatedFields = ProductFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, errorMessage: 'Invalid fields' };
  }

  const productData = {
    productName: validatedFields.data.productName,
    productAddressName: validatedFields.data.productAddressName,
    price: +validatedFields.data.price,
    specialPrice: validatedFields.data.specialPrice
      ? +validatedFields.data.specialPrice
      : null,
    inventoryNumber: +validatedFields.data.inventoryNumber,
    buyLimit: +validatedFields.data.buyLimit,
    thumbnailImage: validatedFields.data.thumbnailImage,
    productDescription: validatedFields.data.productDescription,
  } satisfies ProductTypeForDbInsert;

  const [product] = await drizzleDb
    .insert(Product)
    .values({
      ...productData,
    })
    .returning();

  const relatedCategories = await drizzleDb
    .insert(ProductToCategory)
    .values([
      ...validatedFields.data.categories.map(
        ({ id }) =>
          ({
            categoryId: id,
            productId: product.id,
          }) satisfies ProductToCategoryTypeForDbInsert,
      ),
    ])
    .execute();

  const productImages = await drizzleDb
    .insert(ProductImages)
    .values([
      ...validatedFields.data.images.map(
        (url) =>
          ({
            productId: product.id,
            // url,
            url,
          }) satisfies ProductImagesTypeForDbInsert,
      ),
    ])
    .execute();

  const productFeatures = await drizzleDb
    .insert(ProductFeatures)
    .values([
      ...validatedFields.data.productFeatures.map(
        ({ featureId, featureName }) =>
          ({
            productId: product.id,
            featureId,
            featureName,
          }) satisfies ProductFeaturesTypeForDbInsert,
      ),
    ])
    .returning();

  for (const feature of productFeatures) {
    const matchingFeature = validatedFields.data.productFeatures.find(
      (f) => f.featureId === feature.featureId,
    );

    if (matchingFeature) {
      const { pairs } = matchingFeature;
      await drizzleDb.insert(ProductFeaturePairs).values([
        ...pairs.map(
          ({ pairId, pairKey, pairValue }) =>
            ({
              pairId,
              pairKey,
              pairValue,
              productFeatureId: feature.id,
            }) satisfies ProductFeaturesPairsTypeForDbInsert,
        ),
      ]);
    }
  }

  try {
  } catch (error) {
    console.log('[CreateProductAction]', error);
  }
};
