'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Product, ProductToCategory } from '@/drizzle/schema';
import { ProductFormSchema } from '@/zod';
import * as z from 'zod';

type ProductTypeForDbInsert = typeof Product.$inferInsert;
type ProductToCategoryTypeForDbInsert = typeof ProductToCategory.$inferInsert;

export const Transaction = async (
  data: z.infer<typeof ProductFormSchema>,
): Promise<{
  success: boolean;
  errorMessage: string;
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
    await drizzleDb.transaction(async (tx) => {
      const [product] = await tx
        .insert(Product)
        .values({
          ...productData,
        })
        .returning();

      const relatedCategories = await tx
        .insert(ProductToCategory)
        //@ts-ignore
        .values([
          ...validatedFields.data.categories.map(
            (id) =>
              ({
                //@ts-ignore
                categoryId: iddd,
                productId: product.id,
              }) satisfies ProductToCategoryTypeForDbInsert,
          ),
        ])
        .execute();
    });
    return {
      success: true,
      errorMessage: '',
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};
