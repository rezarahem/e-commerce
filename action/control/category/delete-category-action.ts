'use server';
import * as z from 'zod';
import { CategoryFormSchema } from '@/zod';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category as categorySchema } from '@/drizzle/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export const DeleteCategoryAction = async (id: number | undefined) => {
  if (!id) return { success: false, errorMessage: 'Invalid fields' };

  const validatedId = z.number().safeParse(id);

  if (!validatedId.success)
    return { success: false, errorMessage: 'Invalid fields' };

  try {
    const deletedCategory = await drizzleDb
      .delete(categorySchema)
      .where(eq(categorySchema.id, validatedId.data))
      .returning();

    if (!deletedCategory)
      return { success: false, errorMessage: 'operation failed' };

    revalidatePath('/control/categories');
    return { success: true, errorMessage: '' };
  } catch (error) {
    console.log('DELETE-CATEGORY-ACTION', error);
  }
};
