'use client';

import { Reorder, motion, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Grip, GripHorizontal, X } from 'lucide-react';
import {
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useEffect,
  useState,
} from 'react';
import PairItem from './pair-item';
import * as z from 'zod';
import { ProductFeaturePairSchema, ProductFeatureSchema } from '@/schemas';

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
    updatePairByFeatureIndex(featureIndex, pairsState);
  }, [pairsState]);

  const updatePairByFeatureIndex = (
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

  return (
    <Reorder.Item
      dragControls={dragControls}
      value={feature}
      className='flex flex-col gap-3 pb-8 lg:flex-row'
    >
      <div className='flex gap-2 lg:w-3/12'>
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
        <Button
          //   disabled={loading || productFeatureGroupStateObject.length === 1}
          size='icon'
          className='aspect-square'
          variant='ghost'
          //   onClick={(e) => {
          //     e.preventDefault();
          //     // handleRemoveFeatureGroup(group.groupId);
          //   }}
        >
          <X className='size-4 text-muted-foreground' />
        </Button>
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
        <Button
          //   disabled={loading || productFeatureGroupStateObject.length === 1}
          size='icon'
          variant='ghost'
          //   onClick={(e) => {
          //     e.preventDefault();
          //     // handleRemoveFeatureGroup(group.groupId);
          //   }}
        >
          <ChevronUp className='size-4 text-muted-foreground' />
        </Button>
      </div>

      <Reorder.Group
        axis='y'
        values={pairsState}
        onReorder={setPairsState}
        className='flex w-full flex-col gap-y-2'
      >
        {pairsState.map((p, i) => (
          <PairItem key={p.pairId} pair={p} />
        ))}
      </Reorder.Group>
    </Reorder.Item>
  );
};

export default FeatureItem;
