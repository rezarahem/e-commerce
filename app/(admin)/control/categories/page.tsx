import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { toPersianNumber } from '@/lib/persian-string';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

const CategoriesPage = async () => {
  // get all categories
  const allCats = await drizzleDb.query.Category.findMany();

  return (
    <Container defualtPY className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Heading
          title={`دسته‌بندی‌ها (${toPersianNumber(String(allCats.length))})`}
          description='مدیریت دسته‌بندی‌ها'
        />
        <Link href='/control/categories/new'>
          <Button className='flex items-center justify-center gap-x-1'>
            <p>افزودن</p>
            <PlusIcon className='-ml-[6px] size-4' />
          </Button>
        </Link>
      </div>
      <Separator />
      <div>todo: cat table</div>
    </Container>
  );
};

export default CategoriesPage;
