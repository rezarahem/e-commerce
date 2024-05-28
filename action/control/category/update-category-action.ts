'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { CategoryFormShema } from '@/zod';
import * as z from 'zod';
import { Category as categorySchema } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export const UpdateCategoryAction = async (
  data: z.infer<typeof CategoryFormShema>,
) => {
  const validatedFields = CategoryFormShema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, errorMessage: 'Invalid fields' };
  }

  const {
    categoryAddressName,
    categoryName,
    parentCategorytId,
    currentCategoryId,
  } = validatedFields.data;

  if (!currentCategoryId) {
    return { success: false, errorMessage: 'Invalid fields' };
  }

  try {
    const [category] = await drizzleDb
      .update(categorySchema)
      .set({
        categoryName,
        categoryAddressName,
        parentId: parentCategorytId ? parentCategorytId : null,
      })
      .where(eq(categorySchema.id, currentCategoryId))
      .returning();

    if (!category) return { success: false, errorMessage: 'operation failed' };
    return { success: true, errorMessage: '' };
  } catch (error) {
    console.log('CREATE-CATEGORY-ACTION', error);
  }
};
