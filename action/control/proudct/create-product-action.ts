'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import {
  ProductImages,
  Product,
  ProductFeatures,
  ProductFeaturePairs,
  ProductToCategory,
} from '@/drizzle/schema';
import { ProductFormSchema } from '@/zod';
import { inArray } from 'drizzle-orm';
import * as z from 'zod';

type ProductTypeForDbInsert = typeof Product.$inferInsert;
type ProductToCategoryTypeForDbInsert = typeof ProductToCategory.$inferInsert;
type ProductImagesTypeForDbInsert = typeof ProductImages.$inferInsert;
type ProductFeaturesTypeForDbInsert = typeof ProductFeatures.$inferInsert;
type ProductFeaturesPairsTypeForDbInsert =
  typeof ProductFeaturePairs.$inferInsert;

export const CreateProductAction = async (
  data: z.infer<typeof ProductFormSchema>,
): Promise<{
  success: boolean;
  productId?: number;
  errorMessage?: string;
}> => {
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

  try {
    const { productId } = await drizzleDb.transaction(async (tx) => {
      const [product] = await tx
        .insert(Product)
        .values({
          ...productData,
        })
        .returning({ productId: Product.id });

      // if (!product) {
      //   return {
      //     success: false,
      //     errorMessage: 'Operation Failed',
      //   };
      // }

      const relatedCategories = await tx
        .insert(ProductToCategory)
        .values([
          ...validatedFields.data.categories.map(
            (id) =>
              ({
                categoryId: id,
                productId: product.productId,
              }) satisfies ProductToCategoryTypeForDbInsert,
          ),
        ])
        .returning();

      // if (relatedCategories.length === 0) {
      //   return {
      //     success: false,
      //     errorMessage: 'Operation Failed',
      //   };
      // }

      const productImages = await tx
        .update(ProductImages)
        .set({
          productId: product.productId,
        })
        .where(
          inArray(
            ProductImages.id,
            validatedFields.data.images.map((image) => image.id),
          ),
        )
        .returning();

      // const productImages = await tx
      //   .insert(ProductImages)
      //   .values([
      //     ...validatedFields.data.images.map(
      //       ({ url }) =>
      //         ({
      //           productId: product.id,
      //           url,
      //         }) satisfies ProductImagesTypeForDbInsert,
      //     ),
      //   ])
      //   .returning();

      // if (productImages.length === 0) {
      //   return {
      //     success: false,
      //     errorMessage: 'Operation Failed',
      //   };
      // }

      if (validatedFields.data.productFeatures.length > 0) {
        const productFeatures = await tx
          .insert(ProductFeatures)
          .values([
            ...validatedFields.data.productFeatures.map(
              ({ featureId, featureName }) =>
                ({
                  productId: product.productId,
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
            await tx.insert(ProductFeaturePairs).values([
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
      }

      return {
        productId: product.productId,
      };
    });

    return {
      success: true,
      productId,
    };
  } catch (error) {
    console.log('[CreateProductAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};
