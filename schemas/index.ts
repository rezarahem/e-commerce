import * as z from 'zod';

export const LoginSchema = z.object({
  phone: z.string().min(1),
});

export const NewCategoryFormShema = z.object({
  categoryName: z
    .string({ required_error: 'ثبت عنوان دسته‌بندی الزامی است.' })
    .min(3, 'نام دسته‌بندی حداقل باید ۳ حرف باشد.')
    .refine((value) => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(value), {
      message: `حروف غیر مجاز   (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
    }),
  categoryAddressName: z
    // .regex(/[a-zA-Z0-9]/, 'حروف فارسی غیر مجاز است.')
    .string({ required_error: 'ثبت آدرس دسته‌بندی الزامی است' })
    .toLowerCase()
    .min(3, 'آدرس دسته‌بندی حداقل باید ۳ حرف باشد.')
    .refine((value) => value !== 'new', {
      message: 'کلمه NEW غیر مجاز است.',
    })
    .refine(
      (value) =>
        !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹]/gmu.test(value),
      {
        message: 'حروف فارسی غیر مجاز است',
      },
    ),
  parentCategorytId: z.string().optional(),
});
