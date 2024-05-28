import { ProductFormSchema } from '@/zod';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (
  req: NextRequest,
): Promise<
  NextResponse<{
    success: boolean;
    errorMessage: string;
  }>
> => {
  const data = await req.json();

  const validatedFields = ProductFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return NextResponse.json({
      success: false,
      errorMessage: 'Invalid fields',
    });
  }

  return NextResponse.json({ success: true, errorMessage: '' });
};
