'use server';

import * as z from 'zod';
import { CategoryFormSchema } from '@/zod';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category as categorySchema } from '@/drizzle/schema';
import { revalidatePath } from 'next/cache';

export const CreateCategoryAction = async (
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

    const { categoryAddressName, categoryName, parentCategorytId } =
      validatedFields.data;

    const [category] = await drizzleDb
      .insert(categorySchema)
      .values({
        categoryName,
        categoryAddressName,
        parentId: parentCategorytId ? parentCategorytId : null,
      })
      .returning();

    if (!category) return { success: false, errorMessage: 'operation failed' };

    revalidatePath('/control/categories');

    return { success: true, categoryAddressName: category.categoryAddressName };
  } catch (error) {
    console.log('[CreateCategoryAction]', error);
    return { success: false, errorMessage: 'Internal Error' };
  }
};
