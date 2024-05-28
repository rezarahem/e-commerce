import { removeComma, toEnglishNumber } from '@/lib/persian-string';
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

export const ProductFeaturesArraySchema = z.array(ProductFeatureSchema, {
  message: 'Invalid Inputs',
});

export const ProductFormSchema = z
  .object({
    productName: z
      .string()
      .min(1, 'ثبت عنوان محصول الزامی است.')
      .min(3, 'نام کالا حداقل باید ۳ حرف باشد.')
      .refine((value) => !/[\/\\{}\[\]<>+?؟!!@#$%^&*`'";:,٫~]/gmu.test(value), {
        message: `حروف غیر مجاز (\\/[]{}<>+?,:;'"\`!@#$%^&*؟!٫)`,
      }),
    productAddressName: z
      .string()
      .min(1, 'ثبت آدرس محصول الزامی است.')
      .min(3, 'آدرس محصول حداقل باید ۳ حرف باشد.')
      .toLowerCase()
      .refine(
        (value) =>
          !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی۰۱۲۳۴۵۶۷۸۹]/gmu.test(value),
        {
          message: 'حروف و اعداد فارسی غیر مجاز است.',
        },
      )
      .transform((value) => value.split(' ').join('-')),
    categories: z
      .number()
      .array()
      .min(1, 'هر محصول باید حداقل داری یک دستبه‌بندی باشد.'),
    // .nonempty('هر محصول باید حداقل داری یک دستبه‌بندی باشد.'),
    price: z
      .string({ required_error: 'ثبت قیمت الزامی است.' })
      .min(6, 'حداقل قیمت مجاز ۱۰,۰۰۰ تومان می‌باشد.')
      .refine(
        (value) => !/[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیa-zA-Z]/gmu.test(value),
        {
          message: 'حروف غیر مجاز است.',
        },
      )
      .refine((value) => value[0] !== '۰', 'مقدار غیر مجاز است.')
      .transform((value) => toEnglishNumber(removeComma(value))),
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
      .refine((value) => !value || value[0] !== '۰', 'مقدار غیر مجاز است.')
      .transform((value) =>
        value ? toEnglishNumber(removeComma(value)) : value,
      ),
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
      )
      .transform((value) =>
        value ? toEnglishNumber(removeComma(value)) : value,
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
      .refine((value) => value[0] !== '۰', 'مقدار غیر مجاز است.')
      .transform((value) =>
        value ? toEnglishNumber(removeComma(value)) : value,
      ),
    productDescription: z.string().optional(),
    thumbnailImage: z.string(),
    images: z.string().array().min(1, 'آپلود حداقل یک تصویر الزامی است.'),
    productFeatures: ProductFeaturesArraySchema,
  })
  .superRefine(
    (
      { price, specialPrice, thumbnailImage, categories },
      { addIssue, path },
    ) => {
      // if (categories.length === 0) {
      //   addIssue({
      //     code: 'custom',
      //     message: 'هر محصول باید حداقل داری یک دستبه‌بندی باشد.',
      //     path: ['categories'],
      //     fatal: true,
      //   });

      //   return z.NEVER;
      // }

      if (specialPrice !== undefined) {
        if (+specialPrice > +price) {
          addIssue({
            code: 'custom',
            message: 'قیمت ویژه نباید بزرگتر از قیمت اصلی باشد.',
            path: ['specialPrice'],
            fatal: true,
          });

          return z.NEVER;
        } else if (+specialPrice === +price) {
          addIssue({
            code: 'custom',
            message: 'قیمت ویژه نباید برابر قیمت اصلی باشد.',
            path: ['specialPrice'],
            fatal: true,
          });

          return z.NEVER;
        }
      }

      if (!thumbnailImage) {
        addIssue({
          code: 'custom',
          message: 'انتخاب تصویر کاور الزامی است.',
          path: ['images'],
          fatal: true,
        });

        return z.NEVER;
      }
    },
  )
  .transform((data) => {
    data.productFeatures = data.productFeatures
      .filter((feature) =>
        feature.pairs.some(
          (pair) => pair.pairKey !== '' && pair.pairValue !== '',
        ),
      )
      .map((feature) => ({
        ...feature,
        pairs: feature.pairs.filter(
          (pair) => pair.pairKey !== '' && pair.pairValue !== '',
        ),
      }));
    return data;
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

export const FileArraySchema = z.array(FileSchema);
// .transform((files) =>
//   files.filter(
//     (file) => !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
//   ),
// );

export const testSchema = z.object({
  price: z.string().transform((value) => +value),
});
