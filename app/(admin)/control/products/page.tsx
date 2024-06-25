import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { toPersianNumber } from '@/lib/persian-string';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { count } from 'drizzle-orm';
import { Product } from '@/drizzle/schema';

const ProductsPage = async () => {
  // const allProducts = await drizzleDb.query.Product.findMany();
  const [numberOfProducts] = await drizzleDb
    .select({ count: count() })
    .from(Product);

  return (
    <Container defualtPY className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Heading
          title={`محصولات (${toPersianNumber(String(numberOfProducts.count))})`}
          description='مدیریت محصولات'
        />
        <Link href='/control/products/0000'>
          <Button className='flex items-center justify-center gap-x-1'>
            <p>افزودن</p>
            <PlusIcon className='-ml-[6px] size-4' />
          </Button>
        </Link>
      </div>
      <Separator />
      <div>todo: products table</div>
    </Container>
  );
};

export default ProductsPage;
