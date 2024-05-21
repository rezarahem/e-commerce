'use server';

import { ProductFormSchema } from '@/schemas';
import * as z from 'zod';

export const CreateProductAction = async (
  data: z.infer<typeof ProductFormSchema>,
) => {
  const validatedFields = ProductFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, errorMessage: 'Invalid fields' };
  }

  console.log(validatedFields.data);

  try {
  } catch (error) {
    console.log('[CreateProductAction]', error);
  }
};
