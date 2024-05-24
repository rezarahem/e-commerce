'use client';

import {
  Dispatch,
  SetStateAction,
  TransitionStartFunction,
  useState,
} from 'react';
import { Reorder, motion } from 'framer-motion';
import { FormLabel } from '@/components/ui/form';
import { GripHorizontal, Grip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FeatureItem from './feature-item';
import * as z from 'zod';
import { ProductFeatureSchema } from '@/schemas';

type ProductFormFeaturesProps = {
  features: z.infer<typeof ProductFeatureSchema>[];
  setFeatures: Dispatch<SetStateAction<z.infer<typeof ProductFeatureSchema>[]>>;
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

const ProductFormFeatures = ({
  features,
  setFeatures,
  isPending,
  startTransition,
}: ProductFormFeaturesProps) => {
  // const addNewFeature = () => {
  //   setFeatures((prev) => [
  //     ...prev,
  //     {
  //       groupName: '',
  //       pairs: [{ featureKey: '', featureValue: '' }],
  //     },
  //   ]);
  // };

  // const onChangeUpdateFeatureGroupNameByIndex = (
  //   index: number,
  //   value: string,
  // ) => {
  //   setFeatures((prev) =>
  //     prev.map((f, i) => (i === index ? { ...f, groupName: value } : f)),
  //   );
  // };

  // const removeFeatureByIndex = (index: number) => {
  //   startTransition(() => {
  //     setFeatures((prev) => prev.filter((_, i) => i !== index));
  //   });
  // };

  // const addNewOrUpdatePairByFeatureIndex = (
  //   featureIndex: number,
  //   pairIndex?: number,
  //   featureKey?: string,
  //   featureValue?: string,
  // ) => {
  //   startTransition(() => {
  //     setFeatures((prev) =>
  //       prev.map((item, i) => {
  //         if (i !== featureIndex) {
  //           return item;
  //         }

  //         const updatedPairs = [...item.pairs];

  //         if (pairIndex !== undefined && pairIndex < updatedPairs.length) {
  //           // Update existing pair
  //           updatedPairs[pairIndex] = {
  //             featureKey: featureKey ?? updatedPairs[pairIndex].featureKey,
  //             featureValue:
  //               featureValue ?? updatedPairs[pairIndex].featureValue,
  //           };
  //         } else {
  //           // Add new pair
  //           updatedPairs.push({
  //             featureKey: featureKey ?? '',
  //             featureValue: featureValue ?? '',
  //           });
  //         }

  //         return { ...item, pairs: updatedPairs };
  //       }),
  //     );
  //   });
  // };

  // const removePairByIndex = (featureIndex: number, pairIndex: number) => {
  //   startTransition(() => {
  //     setFeatures((prev) => {
  //       const updatedFeatures = [...prev];

  //       if (featureIndex < updatedFeatures.length) {
  //         // Remove pair at pairIndex from the feature at featureIndex
  //         updatedFeatures[featureIndex].pairs.splice(pairIndex, 1);
  //       }

  //       return updatedFeatures;
  //     });
  //   });
  // };

  return (
    <div className='space-y-3'>
      <FormLabel>ویژگی محصول</FormLabel>
      <Reorder.Group
        axis='y'
        values={features}
        onReorder={setFeatures}
        className='space-y-3'
      >
        {features.map((f, i) => (
          <FeatureItem
            key={f.featureId}
            feature={f}
            featureIndex={i}
            setFeatures={setFeatures}
          />
        ))}
      </Reorder.Group>
      <Button
        disabled={isPending}
        // onClick={(e) => {
        //   e.preventDefault();
        //   addNewFeature();
        // }}
      >
        گروه ویژگی جدید
      </Button>
      {/* <div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            console.log(features);
          }}
        >
          log
        </Button>
      </div> */}
    </div>
  );
};

export default ProductFormFeatures;
