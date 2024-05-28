'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductFeaturePairSchema } from '@/zod';
import { Reorder, useDragControls } from 'framer-motion';
import { Grip, Trash } from 'lucide-react';
import * as z from 'zod';
import { Dispatch, SetStateAction } from 'react';

type PairItemProps = {
  pair: z.infer<typeof ProductFeaturePairSchema>;
  pairIndex: number;
  setPairsState: Dispatch<
    SetStateAction<z.infer<typeof ProductFeaturePairSchema>[]>
  >;
};

const PairItem = ({ pair, pairIndex, setPairsState }: PairItemProps) => {
  const dragControls = useDragControls();

  const removerPairByIndex = () => {
    setPairsState((prev) => prev.filter((_, i) => i !== pairIndex));
  };

  const updatePairsOnChange = (key: 'pairKey' | 'pairValue', value: string) => {
    setPairsState((prev) => {
      return prev.map((p, i) => {
        if (i !== pairIndex) {
          return p;
        }

        return {
          ...p,
          [key]: value,
        };
      });
    });
  };

  return (
    <Reorder.Item
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      // transition={{ duration: 10 }}
      dragControls={dragControls}
      value={pair}
    >
      <div className='flex w-full gap-x-3 py-3'>
        <div>
          <Button
            size='icon'
            variant='ghost'
            onClick={(e) => e.preventDefault()}
            className='hover:cursor-grab active:cursor-grabbing'
            onPointerDown={(e) => {
              dragControls.start(e);
            }}
          >
            <Grip className='size-4 text-muted-foreground' />
          </Button>
        </div>
        <div className='flex w-full gap-x-3'>
          <Input
            id={pair.pairKey}
            type='text'
            placeholder='نام ویژگی'
            value={pair.pairKey}
            onChange={(e) => updatePairsOnChange('pairKey', e.target.value)}
          />
          <Input
            id={pair.pairValue}
            type='text'
            placeholder='شرح ویژگی'
            value={pair.pairValue}
            onChange={(e) => updatePairsOnChange('pairValue', e.target.value)}
          />
        </div>
        <div>
          <Button
            disabled={pairIndex === 0}
            variant='ghost'
            size='icon'
            onClick={(e) => {
              e.preventDefault();
              removerPairByIndex();
            }}
          >
            <Trash className='size-4 text-muted-foreground' />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default PairItem;
