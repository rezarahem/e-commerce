'use client';

import { CreateProductAction } from '@/action/control/proudct/create-product-action';
import AlertModal from '@/components/ui/alert-modal';
import { Button } from '@/components/ui/button';
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
  category,
  category as categorySchema,
  product as productSchema,
  productToCategory,
} from '@/drizzle/schema';
import { cn } from '@/lib/utils';
import { FileListSchema, ProductFormSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, FlagTriangleRight, ImagePlus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  useCallback,
  useEffect,
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
  toPersianNumber,
} from '@/lib/persian-string';
import { Textarea } from '@/components/ui/textarea';
import { S3UploadAction } from '@/action/upload/s3-bucket-action';

type ProductFormProps = {
  product: typeof productSchema.$inferSelect | undefined;
  relatedCategoriesId: { id: number }[] | undefined;
  allCategories: (typeof categorySchema.$inferSelect)[];
};

type ProductFormFieldTypes = z.infer<typeof ProductFormSchema>;

const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  // if null ask user to upload atleast one image
  if (!files) {
    console.log('null');
    return;
  }

  const filesArray = Array.from(files);
  // const currentImagePathArray = [...form.getValues('images')];

  const validatedFiles = FileListSchema.safeParse(filesArray);
  if (!validatedFiles.success) {
    console.log('not good-client');
    return;
  }

  const formData = new FormData();
  filesArray.forEach((file) => {
    formData.append('files', file);
  });

  await S3UploadAction(formData);
};

const ProductForm = ({
  product,
  relatedCategoriesId,
  allCategories,
}: ProductFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setImageFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => Object.assign(file)),
      ]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    multiple: true,
  });

  const router = useRouter();

  useEffect(() => {
    console.log(imageFiles);
  }, [imageFiles]);

  const title = product ? 'ویرایش محصول' : 'ایجاد محصول';
  const description = product
    ? 'مدیریت و ویرایش محصول'
    : 'یک محصول جدید ایجاد کنید.';
  const toastMessage = product ? 'محصول بروز شد' : 'محصول ایجاد شد';
  const action = product ? 'ذخیره تغییرات' : 'ایجاد';

  const form = useForm<ProductFormFieldTypes>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      productName: product?.productName ?? '',
      productAddressName:
        product?.productAddressName.split('-').join(' ') ?? '',
      categories: relatedCategoriesId ?? [],
      price: product
        ? toPersianNumber(
            `${String(product?.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
          )
        : '',
      specialPrice: product
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
      images: [],
    },
  });

  const onDelete = async () => {};

  const onSubmit = (data: ProductFormFieldTypes) => {
    startTransition(async () => {
      await CreateProductAction(data);
    });
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
            <FormField
              control={form.control}
              name='categories'
              render={({ field }) => (
                <FormItem className='flex flex-col justify-start'>
                  <FormLabel className='mb-[6px] mt-1'>دسته‌بندی‌ها</FormLabel>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <FormControl>
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
                                    return field.value.some(({ id }) => {
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
                    <PopoverContent align='start' className='w-[300px] p-0'>
                      <Command>
                        <CommandInput placeholder='جستوجو' className='h-9' />
                        <CommandEmpty>نتیجه یافت نشد.</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {allCategories.map((category) => (
                              <CommandItem
                                value={category.categoryName}
                                key={category.id}
                                onSelect={() => {
                                  if (
                                    form
                                      .getValues('categories')
                                      .filter(({ id }) => id === category.id)
                                      .length === 0
                                  ) {
                                    form.setValue('categories', [
                                      ...form.getValues('categories'),
                                      { id: category.id },
                                    ]);
                                  } else {
                                    form.setValue('categories', [
                                      ...form
                                        .getValues('categories')
                                        .filter(({ id }) => id !== category.id),
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
                                      .some(({ id }) => id === category.id)
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
                  <FormDescription>
                    از اینجا دسته‌بندی‌های مرتبط را انتخاب کنید. هیچ محدودیتی
                    وجود ندارد، با این حال اضافه کردن بیش از ۳ دسته‌بندی پیشنهاد
                    نمی‌گردد.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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

          <div>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='images'>تصاویر</FormLabel>
                  <FormControl className='p-4'>
                    <div className='space-y-5 rounded-md bg-gray-50'>
                      <div {...getRootProps()}>
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
                            onChange={onUpload}
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
                          {field.value.map((url) => (
                            <div
                              key={url}
                              className='relative aspect-square overflow-hidden rounded-md'
                            >
                              <div className='absolute left-2 top-2 z-10'>
                                <Button
                                  variant='destructive'
                                  size='icon'
                                  type='button'
                                  // onClick={() => {
                                  //   if (
                                  //     thumbnailImageStateObject.isThumbnail &&
                                  //     thumbnailImageStateObject.url ===
                                  //       image.url
                                  //   ) {
                                  //     setThumbnailImageStateObject({
                                  //       isThumbnail: false,
                                  //       url: '',
                                  //     });
                                  //   }

                                  //   field.onChange([
                                  //     ...field.value.filter(
                                  //       (currentImage) =>
                                  //         currentImage.url !== image.url,
                                  //     ),
                                  //   ]);
                                  // }}
                                >
                                  <Trash className='h-4 w-4' />
                                </Button>
                              </div>
                              <div className='absolute left-12 top-2 z-10'>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  type='button'
                                  // onClick={() => {
                                  //   setThumbnailImage(image.url);
                                  // }}
                                  className={cn(
                                    'bg-gray-400 text-slate-700 hover:bg-gray-300',
                                    // {
                                    //   'bg-green-500 text-white hover:bg-green-400 hover:text-white':
                                    //     thumbnailImageStateObject.url ===
                                    //     image.url,
                                    // },
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
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
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