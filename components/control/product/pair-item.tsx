'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductFeaturePairSchema } from '@/schemas';
import { Reorder, useDragControls } from 'framer-motion';
import { Grip, Trash } from 'lucide-react';
import * as z from 'zod';

type PairItemProps = {
  pair: z.infer<typeof ProductFeaturePairSchema>;
};

const PairItem = ({ pair }: PairItemProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      dragControls={dragControls}
      value={pair}
      className='flex gap-x-3'
    >
      <Button
        size='icon'
        variant='ghost'
        onClick={(e) => e.preventDefault()}
        className='hover:cursor-grab active:cursor-grabbing'
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
      >
        <Grip className='size-4' />
      </Button>
      <div className='flex gap-x-3'>
        <Input
          className='w-4/12'
          id={pair.pairKey}
          type='text'
          placeholder='نام ویژگی'
          value={pair.pairKey}
          // onChange={}
        />
        <Input
          className='w-4/12'
          id={pair.pairValue}
          type='text'
          placeholder='شرح ویژگی'
          value={pair.pairValue}
          // onChange={}
        />
        <Button
          // disabled={loading || group.groupPairs.length === 1}
          variant='ghost'
          size='icon'
          // onClick={(e) => {
          //   e.preventDefault();
          //   handleRemoveFeaturePair(group.groupId, index);
          // }}
        >
          <Trash className='size-4 text-muted-foreground' />
        </Button>
      </div>
    </Reorder.Item>
  );
};

export default PairItem;
