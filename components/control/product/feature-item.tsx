'use client';

import {
  AnimatePresence,
  Reorder,
  motion,
  useDragControls,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Grip, GripHorizontal, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PairItem from './pair-item';
import * as z from 'zod';
import { ProductFeaturePairSchema, ProductFeatureSchema } from '@/schemas';
import { generateRandomUniqueStringFromDate } from '@/lib/persian-string';

type FeatureItemProps = {
  featureIndex: number;
  feature: z.infer<typeof ProductFeatureSchema>;
  setFeatures: Dispatch<SetStateAction<z.infer<typeof ProductFeatureSchema>[]>>;
};

const FeatureItem = ({
  feature,
  featureIndex,
  setFeatures,
}: FeatureItemProps) => {
  const dragControls = useDragControls();

  const [pairsState, setPairsState] = useState<
    z.infer<typeof ProductFeaturePairSchema>[]
  >(feature.pairs);

  useEffect(() => {
    updateSetFeaturesState(featureIndex, pairsState);
  }, [pairsState]);

  const updateSetFeaturesState = (
    featureIndex: number,
    pairs: typeof pairsState,
  ) => {
    setFeatures((prev) =>
      prev.map((feature, i) => {
        if (i !== featureIndex) {
          return feature;
        }

        return { ...feature, pairs };
      }),
    );
  };

  const addNewPair = () => {
    setPairsState((prev) => [
      ...prev,
      {
        pairId: generateRandomUniqueStringFromDate(),
        pairKey: '',
        pairValue: '',
      },
    ]);
  };

  const removeFeatureByIndex = () => {
    setFeatures((prev) => prev.filter((_, i) => i !== featureIndex));
  };

  return (
    <Reorder.Item
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      // transition={{ opacity: { duration: 0.2 }, height: { duration: 0.4 } }}
      dragControls={dragControls}
      value={feature}
    >
      <div className='grid grid-cols-1 gap-x-3 border-b py-8 lg:grid-cols-12'>
        <div className='col-span-12 flex gap-3 lg:col-span-3'>
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
          <div>
            <Button
              disabled={featureIndex === 0}
              size='icon'
              variant='ghost'
              onClick={(e) => {
                e.preventDefault();
                removeFeatureByIndex();
              }}
            >
              <X className='size-4 text-muted-foreground' />
            </Button>
          </div>
          <div className='w-full'>
            <Input
              id={feature.featureId}
              type='text'
              //   disabled={loading}
              value={feature.featureName}
              placeholder='نام گروه (اختیاری)'
              className='rounded-none border-0 border-b-[1px] shadow-none focus-visible:border-b-[1px] focus-visible:border-black focus-visible:ring-0'
              //   onChange={(e) =>
              //     // handleFeatureGroupNameChange(group.groupId, e.target.value)
              //   }
            />
          </div>
        </div>
        <div className='col-span-12 flex w-full flex-col gap-y-2 lg:col-span-9'>
          <Reorder.Group axis='y' values={pairsState} onReorder={setPairsState}>
            <AnimatePresence initial={false}>
              {pairsState.map((p, i) => (
                <PairItem
                  key={p.pairId}
                  pair={p}
                  pairIndex={i}
                  setPairsState={setPairsState}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
          <Button
            onClick={(e) => {
              e.preventDefault();
              addNewPair();
            }}
            variant='ghost'
            className='col-span-12'
          >
            ویژگی جدید
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
};

export default FeatureItem;
