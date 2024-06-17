'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { CategoryFormSchema } from '@/zod';
import * as z from 'zod';
import { Category } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const UpdateCategoryAction = async (
  data: z.infer<typeof CategoryFormSchema>,
): Promise<{
  success: boolean;
  categoryAddressName?: string;
  errorMessage?: string;
}> => {
  try {
    const validatedFields = CategoryFormSchema.safeParse(data);

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

    const [category] = await drizzleDb
      .update(Category)
      .set({
        categoryName,
        categoryAddressName,
        parentId: parentCategorytId ? parentCategorytId : null,
      })
      .where(eq(Category.id, currentCategoryId))
      .returning();

    if (!category) return { success: false, errorMessage: 'operation failed' };

    revalidatePath(`control/categories/${category.categoryAddressName}`);
    return { success: true, categoryAddressName: category.categoryAddressName };
  } catch (error) {
    console.log('[UpdateCategoryAction]', error);
    return { success: false, errorMessage: 'Internal Error' };
  }
};
