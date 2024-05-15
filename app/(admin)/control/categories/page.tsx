import AlertModal from '@/components/ui/alert-modal';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

const CategoriesPage = () => {
  // get all categories
  return (
    <Container defualtPY className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Heading title='دسته بندی‌ها (۰)' description='مدیریت دسته‌بندی‌ها' />
        <Button>
          <Link href='#' className='flex items-center justify-center gap-x-1'>
            <p>افزودن</p>
            <PlusIcon className='-ml-[6px] size-4' />
          </Link>
        </Button>
      </div>
      <Separator />
      <div>todo: cat table</div>
    </Container>
  );
};

export default CategoriesPage;
