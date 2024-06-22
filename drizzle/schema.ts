import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  serial,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';

export const userRole = pgEnum('userRole', ['ADMIN', 'USER']);

export const Users = pgTable('user', {
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

export const Category = pgTable(
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

export const CategoryRelations = relations(Category, ({ one, many }) => ({
  parentCategory: one(Category, {
    fields: [Category.parentId],
    references: [Category.id],
    relationName: 'categoryRelations',
  }),
  subcategories: many(Category, {
    relationName: 'categoryRelations',
  }),
  productToCategory: many(ProductToCategory),
}));

export const Product = pgTable('product', {
  id: serial('id').primaryKey(),
  productName: text('product_name').notNull(),
  productAddressName: text('product_address_name').notNull(),
  productDescription: text('product_description'),
  price: integer('price').notNull(),
  specialPrice: integer('special_price'),
  inventoryNumber: integer('inventory_number').notNull(),
  buyLimit: integer('buy_limit').notNull(),
  thumbnailImage: text('thumbnail_image').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});

export const ProductRelations = relations(Product, ({ one, many }) => ({
  productToCategory: many(ProductToCategory),
  images: many(ProductImages),
  productFeatures: many(ProductFeatures),
}));

export const ProductImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  productId: integer('product_id').references(() => Product.id, {
    onDelete: 'cascade',
  }),
});

export const ProductIamgesRelations = relations(ProductImages, ({ one }) => ({
  product: one(Product, {
    fields: [ProductImages.productId],
    references: [Product.id],
  }),
}));

export const ProductFeatures = pgTable('product_features', {
  id: serial('id').primaryKey(),
  featureId: text('feature_id').notNull(),
  featureName: text('feature_name'),
  productId: integer('product_id').references(() => Product.id, {
    onDelete: 'cascade',
  }),
});

export const ProductFeaturesRelations = relations(
  ProductFeatures,
  ({ one, many }) => ({
    product: one(Product, {
      fields: [ProductFeatures.productId],
      references: [Product.id],
    }),
    productFeaturePairs: many(ProductFeaturePairs),
  }),
);

export const ProductFeaturePairs = pgTable('product_feature_pairs', {
  id: serial('id').primaryKey(),
  pairId: text('pair_id').notNull(),
  pairKey: text('pair_key').notNull(),
  pairValue: text('pair_value').notNull(),
  productFeatureId: integer('product_feature_id').references(
    () => ProductFeatures.id,
    { onDelete: 'cascade' },
  ),
});

export const ProductFeaturePairsRelations = relations(
  ProductFeaturePairs,
  ({ one }) => ({
    productFeatures: one(ProductFeatures, {
      fields: [ProductFeaturePairs.productFeatureId],
      references: [ProductFeatures.id],
    }),
  }),
);

export const ProductToCategory = pgTable(
  'product_to_category',
  {
    productId: integer('product_id')
      .notNull()
      .references(() => Product.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => Category.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.categoryId] }),
  }),
);

export const ProductToCategoryRelations = relations(
  ProductToCategory,
  ({ one }) => ({
    product: one(Product, {
      fields: [ProductToCategory.productId],
      references: [Product.id],
    }),
    category: one(Category, {
      fields: [ProductToCategory.categoryId],
      references: [Category.id],
    }),
  }),
);

export const Faker = pgTable('faker', {
  id: serial('id').primaryKey(),
  productName: text('product_name').notNull(),
  price: integer('price').notNull(),
  thumbnailImage: text('thumbnail_image').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
});
