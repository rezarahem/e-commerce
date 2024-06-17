'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { GetFakersByCursor } from '@/action/faker/Faker';
import FakerComp from './faker-comp';
import { LucideClipboardSignature } from 'lucide-react';
import { useInView } from 'framer-motion';

type PagiProps = {
  initialFakers: {
    id: number;
    productName: string;
    price: number;
  }[];
};

const Pagi = ({ initialFakers }: PagiProps) => {
  const [fakerState, setFakerState] = useState(initialFakers);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    addMore();
  }, [isInView]);

  const addMore = async () => {
    const more = await GetFakersByCursor(fakerState[fakerState.length - 1].id);
    setFakerState((prev) => [...prev, ...more]);
  };

  return (
    <div>
      <div className='space-y-5'>
        {fakerState.map((faker) => (
          <FakerComp faker={faker} />
        ))}
      </div>
      <div ref={ref}>
        <LucideClipboardSignature className='size-4' />
      </div>
    </div>
  );
};

export default Pagi;
