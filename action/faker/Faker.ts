'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Faker } from '@/drizzle/schema';
import { asc, gt } from 'drizzle-orm';

export const GetFakersByCursor = async (cursor?: number, pageSize = 10) => {
  const fakers = await drizzleDb
    .select({
      id: Faker.id,
      productName: Faker.productName,
      price: Faker.price,
    })
    .from(Faker)
    .where(cursor ? gt(Faker.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(Faker.id));

  return fakers;
};
