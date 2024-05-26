'use client';

import { Category as schemaCategory } from '@/drizzle/schema';
import { CategoryFormShema } from '@/schemas';
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
import { useRouter } from 'next/navigation';
import { UpdateCategoryAction } from '@/action/control/category/update-category-action';
import { CreateCategoryAction } from '@/action/control/category/create-category-action';
import { DeleteCategoryAction } from '@/action/control/category/delete-category-action';

type CategoryFormProps = {
  category: typeof schemaCategory.$inferSelect | undefined;
  allCategories: (typeof schemaCategory.$inferSelect)[];
};

type CategoryFormFieldTypes = z.infer<typeof CategoryFormShema>;

const CategoryForm = ({ category, allCategories }: CategoryFormProps) => {
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

  const categoriesArrayForCombobox = allCategories.filter(
    (item) => item.id !== category?.id,
  );

  const form = useForm<CategoryFormFieldTypes>({
    resolver: zodResolver(CategoryFormShema),
    defaultValues: {
      categoryName: category?.categoryName ?? '',
      categoryAddressName:
        category?.categoryAddressName.split('-').join(' ') ?? '',
      // ?? types? 👇
      parentCategorytId: category?.parentId ?? undefined,
      currentCategoryId: category?.id ?? undefined,
    },
  });

  const onSubmit = async (data: CategoryFormFieldTypes) => {
    const correctFormateCategoryAddressName = data.categoryAddressName
      .split(' ')
      .join('-');

    data = {
      ...data,
      categoryAddressName: correctFormateCategoryAddressName,
    };

    try {
      startTransition(async () => {
        if (category) {
          const result = await UpdateCategoryAction(data);
          if (!result) throw new Error();
        } else {
          const result = await CreateCategoryAction(data);
          if (!result) throw new Error();
        }
      });
      router.refresh();
      router.push('/control/categories');
      toast.success(toastMessage);
    } catch (error) {
      toast.error('خطایی رخ داد');
    }
  };

  const onDelete = async () => {
    try {
      const result = await DeleteCategoryAction(category?.id);
      router.push('/control/categories');
      toast.success('دسته‌بندی حذف شد');
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
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                            ? categoriesArrayForCombobox.find(
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
                            {allCategories.map((category) => (
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
                                    form.setValue(
                                      'parentCategorytId',
                                      undefined,
                                    );
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
                            ))}
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
