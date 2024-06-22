'use client';

import { GetAllCategoriesExceptThisParentAndSubsAction } from '@/action/control/category/get-all-categories-except-this-parent-and-subs-action';
import { Button } from '@/components/ui/button';

const HomePage = async () => {
  return (
    <div className='space-y-5 p-1'>
      <Button
        onClick={async (e) => {
          await GetAllCategoriesExceptThisParentAndSubsAction(39);
        }}
      >
        sql
      </Button>
    </div>
  );
};

export default HomePage;
