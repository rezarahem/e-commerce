import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
} from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';

export const userRole = pgEnum('userRole', ['ADMIN', 'USER']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  phone: text('phone').notNull().unique(),
  role: userRole('role').notNull().default('USER'),
  image: text('image'),
});
