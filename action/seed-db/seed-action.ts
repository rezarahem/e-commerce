'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Faker } from '@/drizzle/schema';
import { faker } from '@faker-js/faker';

const fakeProductObj = {
  productName: faker.commerce.productName(),
  price: +faker.commerce.price(),
  thumbnailImage: faker.image.url(),
} satisfies typeof Faker.$inferInsert;

export const Seed = async () => {
  for (let i = 0; i < 1000; i++) {
    await drizzleDb
      .insert(Faker)
      .values({
        productName: faker.commerce.productName(),
        price: +faker.commerce.price(),
        thumbnailImage: faker.image.url(),
      })
      .execute();
  }
};
