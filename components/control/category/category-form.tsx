'use client';

import { Category } from '@/drizzle/schema';
import { CategoryFormSchema } from '@/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AlertModal from '@/components/ui/alert-modal';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { UpdateCategoryAction } from '@/action/control/category/update-category-action';
import { CreateCategoryAction } from '@/action/control/category/create-category-action';
import { DeleteCategoryAction } from '@/action/control/category/delete-category-action';

type CategoryFormProps = {
  category: typeof Category.$inferSelect | undefined;
  allCategories: (typeof Category.$inferSelect)[];
  allCategoriesExceptParentTreeOrAllCategories: (typeof Category.$inferSelect)[];
};

type CategoryFormFieldTypes = z.infer<typeof CategoryFormSchema>;

// type CategoryFormFieldTypes = z.infer<
//   typeof schemaCategory.$inferSelect | undefined
// >;

const CategoryForm = ({
  category,
  allCategories,
  allCategoriesExceptParentTreeOrAllCategories,
}: CategoryFormProps) => {
  const isUpdating = !!category;
  const [isPending, startTransition] = useTransition();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const router = useRouter();

  const title = category ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی';
  const description = category
    ? 'مدیریت و ویرایش دسته‌بندی'
    : 'یک دسته‌بندی جدید ایجاد کنید.';
  const toastMessage = category ? 'دسته‌بندی بروز شد' : 'دسته‌بندی ایجاد شد';
  const action = category ? 'ذخیره تغییرات' : 'ایجاد';

  // const categoriesArrayForCombobox =
  //   allCategoriesExceptParentTreeOrAllCategories;

  // const categoriesArrayForCombobox = allCategories.filter(
  //   (item) => item.id !== category?.id,
  // );

  // console.log('combo', categoriesArrayForCombobox);
  console.log('tree', allCategoriesExceptParentTreeOrAllCategories);

  const form = useForm<CategoryFormFieldTypes>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      categoryName: category?.categoryName ?? '',
      categoryAddressName:
        category?.categoryAddressName.split('-').join(' ') ?? '',
      // ?? types? 👇
      parentCategorytId: category?.parentId ?? null,
      currentCategoryId: category?.id ?? undefined,
    },
  });

  const onSubmit = (data: CategoryFormFieldTypes) => {
    try {
      startTransition(async () => {
        const validatedFields = CategoryFormSchema.safeParse(data);

        if (!validatedFields.success) {
          toast.error('خطایی رخ داد');
          return;
        }

        const result = await CreateCategoryAction(validatedFields.data);

        if (!result.success) {
          toast.error('خطایی رخ داد، لطفا چند دقیقه دیگر تلاش کنید.');
          return;
        }

        if (
          result.success &&
          result.categoryAddressName &&
          !result.errorMessage
        ) {
          toast.success(toastMessage);
          redirect(`/control/categories/${result.categoryAddressName}`);
        }
      });
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  const onUpdate = (data: CategoryFormFieldTypes) => {
    try {
      startTransition(async () => {
        const validatedFields = CategoryFormSchema.safeParse(data);

        if (!validatedFields.success) {
          toast.error('خطایی رخ داد');
          return;
        }

        const result = await UpdateCategoryAction(validatedFields.data);

        if (!result.success) {
          toast.error('خطایی رخ داد، لطفا چند دقیقه دیگر تلاش کنید.');
          return;
        }

        if (
          result.success &&
          result.categoryAddressName &&
          !result.errorMessage
        ) {
          toast.success(toastMessage);
          redirect(`/control/categories/${result.categoryAddressName}`);
        }
      });
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  const onDelete = () => {
    try {
      startTransition(async () => {
        const result = await DeleteCategoryAction(category?.id);
        toast.success('دسته‌بندی حذف شد');
        redirect('/control/categories');
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
        {category && (
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
              name='categoryName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام دسته‌بندی</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder='نام دسته‌بندی'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='categoryAddressName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>آدرس دسته‌بندی</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder='آدرس دسته‌بندی'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='parentCategorytId'
              render={({ field }) => (
                <FormItem className='flex flex-col justify-start'>
                  <FormLabel className='mb-[6px] mt-1'>
                    دسته‌بندی مادر
                  </FormLabel>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn('justify-between', {
                            'font-normal text-muted-foreground': !field.value,
                          })}
                        >
                          {field.value
                            ? allCategoriesExceptParentTreeOrAllCategories.find(
                                (category) => category.id === field.value,
                              )?.categoryName
                            : 'انتخاب کنید'}
                          <CaretSortIcon className='-ml-2 size-4 shrink-0 opacity-90' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='w-[300px] p-0'>
                      <Command>
                        <CommandInput placeholder='جستوجو' className='h-9' />
                        <CommandEmpty>نتیجه یافت نشد</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {allCategoriesExceptParentTreeOrAllCategories.map(
                              (category) => (
                                <CommandItem
                                  value={category.categoryName}
                                  key={category.id}
                                  onSelect={() => {
                                    if (
                                      !form.getValues('parentCategorytId') ||
                                      form.getValues('parentCategorytId') !==
                                        category.id
                                    ) {
                                      form.setValue(
                                        'parentCategorytId',
                                        category.id,
                                      );
                                    } else {
                                      form.setValue('parentCategorytId', null);
                                    }
                                  }}
                                >
                                  {category.categoryName}
                                  <CheckIcon
                                    className={cn(
                                      'mr-auto h-4 w-4',
                                      category.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ),
                            )}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    از اینجا دسته‌بندی مادر را انتخاب کنید. هر دسته‌بندی تنها
                    می‌تواند یک مادر داشته باشد.
                  </FormDescription>
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

export default CategoryForm;
