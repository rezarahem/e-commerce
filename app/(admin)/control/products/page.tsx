import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import Heading from '@/components/ui/heading';
import { drizzleDb } from '@/drizzle/drizzle-db';
import { toPersianNumber } from '@/lib/persian-string';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ProductsPage = async () => {
  const allProducts = await drizzleDb.query.product.findMany();

  return (
    <Container defualtPY className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Heading
          title={`محصولات (${toPersianNumber(String(allProducts.length))})`}
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
