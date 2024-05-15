import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';

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
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const category = pgTable('category', {
  id: serial('id').primaryKey(),
  categoryName: text('category_name').unique().notNull(),
  // categoryAddressName: text('category_address_name').unique().notNull(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const categoryRelations = relations(category, ({ one, many }) => ({
  parentCategory: one(category, {
    fields: [category.parentId],
    references: [category.id],
    relationName: 'categoryRelations',
  }),
  subcategories: many(category, {
    relationName: 'categoryRelations',
  }),
  productToCategory: many(productToCategory),
}));

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  productName: text('product_name').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  productToCategory: many(productToCategory),
}));

export const productToCategory = pgTable(
  'product_to_category',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => product.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => category.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
  }),
);

export const productToCategoryRelations = relations(
  productToCategory,
  ({ one }) => ({
    product: one(product, {
      fields: [productToCategory.productId],
      references: [product.id],
    }),
    category: one(category, {
      fields: [productToCategory.categoryId],
      references: [category.id],
    }),
  }),
);
