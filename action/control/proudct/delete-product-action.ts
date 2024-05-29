'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Product } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export const DeleteProductAction = async (
  id: number,
): Promise<{
  success: boolean;
  errorMessage?: string;
}> => {
  try {
    const [deletedProduct] = await drizzleDb
      .delete(Product)
      .where(eq(Product.id, id))
      .returning();

    if (!deletedProduct) {
      return {
        success: false,
        errorMessage: 'Operation Failed',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log('[DeleteProductAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};
