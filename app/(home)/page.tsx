'use client';

import { GetAllProductsFromCategoryTreeAction } from '@/action/search/get-all-products-from-category-tree-action';
import { Button } from '@/components/ui/button';

const HomePage = async () => {
  return (
    <div className='space-y-5 p-1'>
      <Button
        onClick={async (e) => {
          await GetAllProductsFromCategoryTreeAction(36);
        }}
      >
        sql
      </Button>
    </div>
  );
};

export default HomePage;
