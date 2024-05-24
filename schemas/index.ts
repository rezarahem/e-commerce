import * as z from 'zod';

export const LoginSchema = z.object({
  phone: z.string().min(1),
});

export const CategoryFormShema = z.object({
  categoryName: z
    .string({ required_error: 'ثبت عنوان دسته‌بندی الزامی است.' })
    .min(3, 'نام دسته‌بندی حداقل باید ۳ حرف باشد.')
    .refine((value) => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(value), {
      message: `حروف غیر مجاز   (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
    }),
  // .regex(/[a-zA-Z0-9]/, 'حروف فارسی غیر مجاز است.')
  categoryAddressName: z
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
  parentCategorytId: z.number().optional(),
  currentCategoryId: z.number().optional(),
});

// export const ProductFeaturesSchema = z
//   .object({
//     featureId: z.string(),
//     featureName: z.string().optional(),
//     pairs: z
//       .object({
//         pairId: z.string(),
//         pairKey: z.string(),
//         pairValue: z.string(),
//       })
//       .array(),
//   })
//   .array();

export const ProductFeaturePairSchema = z.object({
  pairId: z.string(),
  pairKey: z.string(),
  pairValue: z.string(),
});

export const ProductFeatureSchema = z.object({
  featureId: z.string(),
  featureName: z.string().optional(),
  pairs: z.array(ProductFeaturePairSchema),
});

export const ProductFormSchema = z.object({
  productName: z
    .string({ required_error: 'ثبت عنوان محصول الزامی است.' })
    .min(3, 'نام کالا حداقل باید ۳ حرف باشد.')
    .refine((value) => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(value), {
      message: `حروف غیر مجاز (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
    }),
  productAddressName: z
    .string({ required_error: 'ثبت آدرس محصول الزامی است.' })
    .toLowerCase()
    .min(3, 'آدرس محصول حداقل باید ۳ حرف باشد.')
    .refine(
      (value) =>
        !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹]/gmu.test(value),
      {
        message: 'حروف و اعداد فارسی غیر مجاز است.',
      },
    ),
  categories: z.object({ id: z.number() }).array(),
  price: z
    .string({ required_error: 'ثبت قیمت الزامی است.' })
    .min(6, 'حداقل قیمت مجاز ۱۰,۰۰۰ تومان می‌باشد.')
    .refine(
      (value) => !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
      {
        message: 'حروف غیر مجاز است.',
      },
    )
    .refine((value) => value[0] !== '۰', 'مقدار غیر مجاز است.'),
  specialPrice: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value || !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
      {
        message: 'حروف غیر مجاز است.',
      },
    )
    .refine((value) => !value || value[0] !== '۰', 'مقدار غیر مجاز است.'),
  inventoryNumber: z
    .string()
    .min(1, 'لطفا موجودی را وارد کنید.')
    .refine(
      (value) => !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
      {
        message: 'حروف غیر مجاز است.',
      },
    )
    .refine(
      (value) => value.length < 2 || value[0] !== '۰',
      'مقدار غیر مجاز است.',
    ),
  buyLimit: z
    .string({ required_error: 'ثبت محدودیت الزامی است.' })
    .min(1, 'ثبت محدودیت الزامی است.')
    .refine(
      (value) => !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
      {
        message: 'حروف غیر مجاز است.',
      },
    )
    .refine((value) => value[0] !== '۰', 'مقدار غیر مجاز است.'),
  productDescription: z.string().optional(),
  thumbnailImage: z.string(),
  images: z.string().array(),
  productFeatures: z.array(ProductFeatureSchema),
});

export const FileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'حجم فایل نباید بیش از ۵ مگابایت باشد.',
  })
  .refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
    {
      message: 'نوع فایل باید PNG یا JPG باشد.',
    },
  );

export const FileListSchema = z.array(FileSchema);
