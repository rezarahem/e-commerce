// import { ProductFormSchema } from '@/schemas';
// import { NextRequest, NextResponse } from 'next/server';

// export const POST = async (req: NextRequest) => {
//   const data = await req.json();

//   const validatedFields = ProductFormSchema.safeParse(data);

//   if (!validatedFields.success) {
//     return NextResponse.json({
//       success: false,
//       errorMessage: 'Invalid fields',
//     });
//   }

//   if (!data) {
//     return NextResponse.json({ success: false });
//   }

//   return NextResponse.json({ success: true });
// };
