'use client';

import { Seed } from '@/action/seed-db/seed-action';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';

const FakerPage = () => {
  const [isPending, startTransition] = useTransition();
  const [no, setNo] = useState('');

  const isOkToFake = false;

  const onCall = async () => {
    startTransition(() => {
      if (isOkToFake) {
        Seed();
      } else {
        setNo('Not now darling');
      }
    });
  };

  return (
    <>
      <Button disabled={isPending} onClick={onCall}>
        Faker goes
      </Button>
      <p>{no}</p>
    </>
  );
};

export default FakerPage;
