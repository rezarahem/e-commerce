'use server';

import * as z from 'zod';
import { CategoryFormShema } from '@/schemas';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category as categorySchema } from '@/drizzle/schema';
import { revalidatePath } from 'next/cache';

export const CreateCategoryAction = async (
  data: z.infer<typeof CategoryFormShema>,
) => {
  const validatedFields = CategoryFormShema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, errorMessage: 'Invalid fields' };
  }

  const { categoryAddressName, categoryName, parentCategorytId } =
    validatedFields.data;

  try {
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
    return { success: true, errorMessage: '' };
  } catch (error) {
    console.log('[CreateCategoryAction]', error);
  }
};
