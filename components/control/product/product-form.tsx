'use client';

import AlertModal from '@/components/ui/alert-modal';
import { Button } from '@/components/ui/button';
import { CreateProductAction } from '@/action/control/proudct/create-product-action';
import Image from 'next/image';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Category as categorySchema,
  ProductFeatures,
  ProductFeaturePairs,
  Product as productSchema,
} from '@/drizzle/schema';
import { cn } from '@/lib/utils';
import {
  FileArraySchema,
  ProductFormSchema,
  ProductFeatureSchema,
  ProductFeaturesArraySchema,
} from '@/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckIcon,
  CircleHelp,
  FlagTriangleRight,
  GripHorizontal,
  ImagePlus,
  Plus,
  Trash,
  X,
} from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import {
  ChangeEvent,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import { CaretSortIcon } from '@radix-ui/react-icons';
import * as z from 'zod';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  addCommaAndRetuenPersianStringNumberOnChange,
  generateRandomUniqueStringFromDate,
  removeComma,
  toEnglishNumber,
  toPersianNumber,
} from '@/lib/persian-string';
import { Textarea } from '@/components/ui/textarea';
import {
  S3DeleteAllImagesFromBucketAndDbAction,
  S3DeleteAllImagesOnlyFromBucket,
  S3DeleteImageFromBucketAndDbAction,
  S3UploadAllImagesToBucketAndDbAction,
} from '@/action/upload/s3-bucket-action';
import toast from 'react-hot-toast';
import ProductFormFeatures from './product-form-features';
import axios from 'axios';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DeleteProductAction } from '@/action/control/proudct/delete-product-action';

type ProductFormProps = {
  product: typeof productSchema.$inferSelect | undefined;
  productImages: { id?: number; url: string }[] | undefined;
  productFeatures: z.infer<typeof ProductFeatureSchema>[] | undefined;
  relatedCategoriesId: { id: number }[] | undefined;
  allCategories: (typeof categorySchema.$inferSelect)[];
};

type ProductFormFieldsTypes = z.infer<typeof ProductFormSchema>;

const ProductForm = ({
  product,
  productImages,
  productFeatures,
  relatedCategoriesId,
  allCategories,
}: ProductFormProps) => {
  const isUpdating = !!product;
  const [isPending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [thumbnailImageState, setThumbnailImageState] = useState(
    product?.thumbnailImage ?? '',
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [productFeaturesState, setProductFeaturesState] = useState<
    z.infer<typeof ProductFeatureSchema>[]
  >(
    productFeatures ?? [
      {
        featureId: generateRandomUniqueStringFromDate(),
        featureName: '',
        pairs: [
          {
            pairId: generateRandomUniqueStringFromDate(),
            pairKey: '',
            pairValue: '',
          },
        ],
      },
    ],
  );
  // const validatedFiles = FileListSchema.safeParse(imageFiles);
  // if (!validatedFiles.success) {
  //   const errorArray = validatedFiles.error.errors;
  //   form.setError('images', {
  //     message: errorArray[errorArray.length - 1].message,
  //   });

  const validateImages = (files: File[]) => {
    const validatedFields = FileArraySchema.safeParse(files);

    if (!validatedFields.success) {
      const errorArray = validatedFields.error.errors;
      form.setError('images', {
        message: errorArray[errorArray.length - 1].message,
      });
      return { success: false };
    }

    form.clearErrors('images');
    return { success: true };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    if (!validateImages(acceptedFiles).success) return;

    setImageFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => Object.assign(file)),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    multiple: true,
  });

  useEffect(() => {
    if (imageFiles.length === 0) return;

    onUpload();
  }, [imageFiles]);

  useEffect(() => {
    if (productFeaturesState.length === 0) return;

    form.setValue('productFeatures', productFeaturesState);
  }, [productFeaturesState]);

  const title = product ? 'ویرایش محصول' : 'ایجاد محصول';
  const description = product
    ? 'مدیریت و ویرایش محصول'
    : 'یک محصول جدید ایجاد کنید.';
  const toastMessage = product ? 'محصول بروز شد' : 'محصول ایجاد شد';
  const action = product ? 'ذخیره تغییرات' : 'ایجاد';

  const form = useForm<ProductFormFieldsTypes>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      productName: product?.productName ?? '',
      productAddressName:
        product?.productAddressName.split('-').join(' ') ?? '',
      categories: relatedCategoriesId?.map(({ id }) => id) ?? [],
      price: product
        ? toPersianNumber(
            `${String(product?.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          )
        : '',
      specialPrice: product?.specialPrice
        ? toPersianNumber(
            `${String(product?.specialPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          )
        : '',
      inventoryNumber: product
        ? toPersianNumber(
            `${String(product?.inventoryNumber).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          )
        : '',
      buyLimit: product
        ? toPersianNumber(
            `${String(product?.buyLimit).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          )
        : '',
      productDescription: product?.productDescription ?? '',
      thumbnailImage: thumbnailImageState,
      images: productImages ?? [],
      productFeatures: productFeaturesState,
    },
  });

  useEffect(() => {
    form.clearErrors('categories');
  }, [form.getValues('categories')]);

  const handleInputFileOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    if (!validateImages(filesArray).success) return;

    setImageFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };

  const onUpload = async () => {
    try {
      startTransition(async () => {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('files', file);
        });
        const res = await S3UploadAllImagesToBucketAndDbAction(formData);

        if (!res) {
          toast.error('خطایی رخ داد');
          return;
        }

        if (!res?.success) {
          toast.error('خطایی رخ داد');
          return;
        }

        if (res.success && res.images) {
          form.setValue('images', [...form.getValues('images'), ...res.images]);
        }

        setImageFiles([]);
      });
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  const onDeleteProductImage = (image: { id: number; url: string }) => {
    try {
      startTransition(async () => {
        const res = await S3DeleteImageFromBucketAndDbAction(image);

        if (!res) {
          toast.error('خطایی رخ داد');
          return;
        }

        if (!res?.success && res.errorMessage) {
          toast.error('خطایی رخ داد');
          return;
        }

        if (res.success) {
          // removing the image from thumbnail if IT IS THUMBNAIL
          if (form.getValues('thumbnailImage') === image.url) {
            setThumbnailImageState('');
            form.setValue('thumbnailImage', '');
          }

          // removing the image from images url array
          form.setValue('images', [
            ...form.getValues('images').filter((i) => i.url !== image.url),
          ]);
        }
      });
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  const onSubmit = (data: ProductFormFieldsTypes) => {
    try {
      startTransition(async () => {
        const validatedFields = ProductFormSchema.safeParse(data);

        if (!validatedFields.success) {
          toast.error('خطایی رخ داد');
          return;
        }

        const result = await CreateProductAction(validatedFields.data);

        if (!result) {
          toast.error('خطایی رخ داد');
          return;
        }

        if (!result.success) {
          toast.error('خطایی رخ داد، لطفا چند دقیقه دیگر تلاش کنید.');
          return;
        }

        if (result.success && result.productId && !result.errorMessage) {
          toast.success(toastMessage);
          redirect(`/control/products/${result.productId}`);
        }
      });
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  const onUpdate = (data: ProductFormFieldsTypes) => {
    console.log('update');
  };

  const onDelete = () => {
    try {
      startTransition(async () => {
        const validatedFields = ProductFormSchema.safeParse(form.getValues());

        if (!validatedFields.success) {
          toast.error('خطایی رخ داد');
          return;
        }

        let allowedToCarryOn: {
          ok: boolean;
        } = {
          ok: true,
        };

        if (validatedFields.data.images.length > 0) {
          const deleteImagesResponse = await S3DeleteAllImagesOnlyFromBucket(
            validatedFields.data.images,
          );

          if (
            !deleteImagesResponse.success &&
            deleteImagesResponse.errorMessage
          ) {
            allowedToCarryOn.ok = false;
          } else {
            form.setValue('thumbnailImage', '');
            form.setValue('images', []);
            allowedToCarryOn.ok = true;
          }
        }

        if (!allowedToCarryOn.ok) {
          toast.error('خطایی رخ داد');
          return;
        }

        const deletedProduct = await DeleteProductAction(product?.id as number);

        if (!deletedProduct.success && deletedProduct.errorMessage) {
          toast.error('خطایی رخ داد');
          return;
        }

        setOpenAlertModal(false);
        toast.success(toastMessage);
        redirect('/control/products');

        // if (allowedToCarryOn.ok) {
        //   toast.success('cool');
        // }
        //
        //
      });
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  return (
    <>
      <AlertModal
        isOpne={openAlertModal}
        onClose={() => setOpenAlertModal(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {product && (
          <Button
            disabled={isPending}
            variant='destructive'
            size='icon'
            onClick={() => setOpenAlertModal(true)}
          >
            <Trash className='size-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(!isUpdating ? onSubmit : onUpdate)}
          className='space-y-8'
        >
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            <FormField
              control={form.control}
              name='productName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام محصول</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      disabled={isPending}
                      placeholder='نام محصول'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='productAddressName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس محصول</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      disabled={isPending}
                      placeholder='آدرس محصول'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name='categories'
                render={({ field }) => (
                  <FormItem className='flex flex-col justify-start'>
                    <div className='flex gap-x-2'>
                      <FormLabel className='mb-[6px] mt-1'>
                        دسته‌بندی‌ها
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className='mb-1'>
                            <CircleHelp className='size-4 text-muted-foreground' />
                          </TooltipTrigger>
                          <TooltipContent className='w-[200px] text-balance text-justify '>
                            از اینجا دسته‌بندی‌های مرتبط را انتخاب کنید. هیچ
                            محدودیتی وجود ندارد، با این حال اضافه کردن بیش از ۳
                            دسته‌بندی پیشنهاد نمی‌گردد.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <FormControl {...field}>
                          <Button
                            disabled={isPending}
                            variant='outline'
                            role='combobox'
                            className={cn('grid grid-cols-12 gap-x-2', {
                              'font-normal text-muted-foreground':
                                field.value.length < 1,
                            })}
                          >
                            <div className='col-span-11 w-full overflow-hidden text-right'>
                              {field.value.length > 0 ? (
                                <div>
                                  {allCategories
                                    .filter((category) => {
                                      return field.value.some((id) => {
                                        return id === category.id;
                                      });
                                    })
                                    .map((filteredCategory) => (
                                      <span
                                        key={filteredCategory.id}
                                        className='ml-1 inline-block rounded-full bg-gray-300 px-3'
                                      >
                                        {filteredCategory.categoryName}
                                      </span>
                                    ))}
                                </div>
                              ) : (
                                'انتخاب کنید'
                              )}
                            </div>
                            <div className='col-span-1 mr-auto'>
                              <CaretSortIcon className='-ml-1 size-4 shrink-0 opacity-90' />
                            </div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align='start' className='p-0'>
                        <Command>
                          <CommandInput placeholder='جستوجو' className='h-9' />
                          <CommandEmpty>نتیجه یافت نشد.</CommandEmpty>
                          <CommandGroup>
                            <CommandList className='px-1 scrollbar-silk-no-bg'>
                              {allCategories.map((category) => (
                                <CommandItem
                                  value={category.categoryName}
                                  key={category.id}
                                  onSelect={() => {
                                    if (
                                      form
                                        .getValues('categories')
                                        .filter((id) => id === category.id)
                                        .length === 0
                                    ) {
                                      form.setValue('categories', [
                                        ...form.getValues('categories'),
                                        category.id,
                                        // { id: category.id },
                                      ]);
                                    } else {
                                      form.setValue('categories', [
                                        ...form
                                          .getValues('categories')
                                          .filter((id) => id !== category.id),
                                      ]);
                                    }
                                  }}
                                >
                                  {category.categoryName}
                                  <CheckIcon
                                    className={cn(
                                      'mr-auto h-4 w-4',
                                      form
                                        .getValues('categories')
                                        .some((id) => id === category.id)
                                        ? ''
                                        : 'hidden',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {/* <FormDescription>
                      از اینجا دسته‌بندی‌های مرتبط را انتخاب کنید. هیچ محدودیتی
                      وجود ندارد، با این حال اضافه کردن بیش از ۳ دسته‌بندی
                      پیشنهاد نمی‌گردد.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-4'>
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>قیمت</FormLabel>
                  <FormControl
                    onChange={() => {
                      form.setValue(
                        'price',
                        addCommaAndRetuenPersianStringNumberOnChange(
                          form.getValues('price'),
                        ),
                      );
                    }}
                  >
                    <div className='flex items-center justify-between gap-x-2'>
                      <Input
                        type='text'
                        disabled={isPending}
                        placeholder='قیمت محصول'
                        {...field}
                      />
                      <span className='text-xs text-muted-foreground'>
                        تومانء
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='specialPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>قیمت ویژه</FormLabel>
                  <FormControl
                    onChange={() => {
                      form.setValue(
                        'specialPrice',
                        addCommaAndRetuenPersianStringNumberOnChange(
                          form.getValues('specialPrice') as string,
                        ),
                      );
                    }}
                  >
                    <div className='flex items-center justify-between gap-x-2'>
                      <Input
                        type='text'
                        disabled={isPending}
                        {...field}
                        placeholder='بدون قیمت ویژه'
                      />
                      <span className='text-xs text-muted-foreground'>
                        تومانء
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='inventoryNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موجودی</FormLabel>
                  <FormControl
                    onChange={() => {
                      form.setValue(
                        'inventoryNumber',
                        addCommaAndRetuenPersianStringNumberOnChange(
                          form.getValues('inventoryNumber'),
                        ),
                      );
                    }}
                  >
                    <Input
                      type='text'
                      disabled={isPending}
                      placeholder='موجودی'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='buyLimit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>محدودیت سبد خرید</FormLabel>
                  <FormControl
                    onChange={() => {
                      form.setValue(
                        'buyLimit',
                        addCommaAndRetuenPersianStringNumberOnChange(
                          form.getValues('buyLimit'),
                        ),
                      );
                    }}
                  >
                    <Input
                      type='text'
                      disabled={isPending}
                      placeholder='محدویت سبد خرید'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name='productDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      disabled={isPending}
                      placeholder='شرح محصول'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ProductFormFeatures
            features={productFeaturesState}
            setFeatures={setProductFeaturesState}
            isPending={isPending}
            startTransition={startTransition}
          />

          <div>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='images'>تصاویر</FormLabel>
                  <FormControl className='p-4'>
                    <div className='space-y-5 rounded-md bg-gray-50'>
                      <div
                        {...getRootProps({
                          onClick: (e) => {
                            e.preventDefault();
                          },
                        })}
                      >
                        <label
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded border-2 border-dashed py-20 hover:opacity-60',
                            {
                              'border-blue-500': isDragActive,
                            },
                          )}
                        >
                          <input
                            {...getInputProps()}
                            id='images'
                            type='file'
                            multiple
                            onChange={handleInputFileOnChange}
                            disabled={isPending}
                            hidden
                          />
                          <ImagePlus
                            className={cn('size-4', {
                              'text-blue-500': isDragActive,
                            })}
                          />
                        </label>
                      </div>

                      {field.value.length > 0 && (
                        <div className='grid grid-cols-2 gap-4 lg:grid-cols-6'>
                          {field.value.map(({ id, url }) => (
                            <div
                              key={id}
                              className='relative aspect-square overflow-hidden rounded-md'
                            >
                              <div className='absolute left-2 top-2 z-10'>
                                <Button
                                  variant='destructive'
                                  size='icon'
                                  type='button'
                                  disabled={isPending}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onDeleteProductImage({
                                      id,
                                      url,
                                    });
                                  }}
                                >
                                  <Trash className='size-4' />
                                </Button>
                              </div>
                              <div className='absolute left-12 top-2 z-10'>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  type='button'
                                  disabled={isPending}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setThumbnailImageState(url);
                                    form.setValue('thumbnailImage', url);
                                  }}
                                  className={cn(
                                    'bg-gray-400 text-slate-700 hover:bg-gray-300',
                                    {
                                      'bg-green-500 text-white hover:bg-green-400 hover:text-white':
                                        thumbnailImageState === url,
                                    },
                                  )}
                                >
                                  <FlagTriangleRight className='h-4 w-4' />
                                </Button>
                              </div>
                              <Image
                                alt='Image'
                                src={url}
                                fill
                                priority={true}
                                sizes='100vw'
                                className='object-cover'
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
