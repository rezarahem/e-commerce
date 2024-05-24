import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  AnyPgColumn,
  uniqueIndex,
  numeric,
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

export const category = pgTable(
  'category',
  {
    id: serial('id').primaryKey(),
    categoryName: text('category_name').unique().notNull(),
    categoryAddressName: text('category_address_name').notNull(),
    parentId: integer('parent_id'),
  },
  (table) => {
    return {
      categoryAddressNameIndex: uniqueIndex('category_address_name_index').on(
        table.categoryAddressName,
      ),
    };
  },
);

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
  productAddressName: text('product_address_name').notNull(),
  productDescription: text('product_description'),
  price: numeric('price').notNull(),
  specialPrice: numeric('special_price').notNull(),
  inventoryNumber: integer('inventory_number').notNull(),
  buyLimit: integer('buy_limit').notNull(),
  thumbnailImage: text('thumbnail_image').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const productRelations = relations(product, ({ one, many }) => ({
  productToCategory: many(productToCategory),
  images: many(productImages),
  productFeatureGroup: many(productFeatureGroup),
}));

export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  productId: integer('product_id'),
});

export const productIamgesRelations = relations(productImages, ({ one }) => ({
  product: one(product, {
    fields: [productImages.productId],
    references: [product.id],
  }),
}));

export const productFeatureGroup = pgTable('product_feature_group', {
  id: serial('id').primaryKey(),
  groupName: text('group_name').notNull(),
  productId: integer('product_id'),
});

export const productFeatureGroupRelations = relations(
  productFeatureGroup,
  ({ one, many }) => ({
    product: one(product, {
      fields: [productFeatureGroup.productId],
      references: [product.id],
    }),
    productFeaturePairs: many(productFeaturePairs),
  }),
);

export const productFeaturePairs = pgTable('product_feature_pairs', {
  id: serial('id').primaryKey(),
  featureKey: text('feature_key').notNull(),
  featureValue: text('feature_value').notNull(),
  productFeaturGroupId: integer('product_feature_group_id'),
});

export const productFeaturePairsRelations = relations(
  productFeaturePairs,
  ({ one }) => ({
    productFeatureGroup: one(productFeatureGroup, {
      fields: [productFeaturePairs.productFeaturGroupId],
      references: [productFeatureGroup.id],
    }),
  }),
);

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
