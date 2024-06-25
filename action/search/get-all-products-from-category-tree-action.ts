'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category, Product, ProductToCategory } from '@/drizzle/schema';
import { sql } from 'drizzle-orm';

type InferredPorductType = typeof Product.$inferSelect;

export const GetAllProductsFromCategoryTreeAction = async (
  categoryId: number,
): Promise<{
  success: boolean;
  products?: InferredPorductType[];
  errorMessage?: string;
}> => {
  try {
    const result: InferredPorductType[] = await drizzleDb.execute(sql`
      WITH RECURSIVE category_tree AS (
        SELECT id
        FROM ${Category}
        WHERE id = ${categoryId}
        UNION ALL
        SELECT c.id
        FROM ${Category} c
        INNER JOIN category_tree ct ON ct.id = c.parent_id
      )
      SELECT DISTINCT 
        p.id,
        p.product_name AS "productName",
        p.product_address_name AS "productAddressName",
        p.product_description AS "productDescription",
        p.price,
        p.special_price AS "specialPrice",
        p.inventory_number AS "inventoryNumber",
        p.buy_limit AS "buyLimit",
        p.thumbnail_image AS "thumbnailImage",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM ${Product} p
      INNER JOIN ${ProductToCategory} ptc ON p.id = ptc.product_id
      INNER JOIN category_tree ct ON ptc.category_id = ct.id
    `);

    if (!result) {
      return {
        success: false,
        errorMessage: 'Operation failed.',
      };
    }

    if (result.length === 0) {
      return {
        success: false,
        errorMessage: 'No categories found.',
      };
    }

    return {
      success: true,
      products: result,
    };
  } catch (error) {
    console.log('[GetAllProductsFromCategoryTreeAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};

// export const GetAllProductsFromCategoryTree = async (categoryId: number) => {
//   try {
//     const categoryIds: { id: number }[] = await drizzleDb.execute(sql`
//       WITH RECURSIVE category_tree AS (
//         SELECT id
//         FROM ${Category}
//         WHERE id = ${categoryId}
//         UNION ALL
//         SELECT c.id
//         FROM ${Category} c
//         INNER JOIN category_tree ct ON ct.id = c.parent_id
//       )
//       SELECT id FROM category_tree;
//     `);

//     const ids = categoryIds.map((r) => r.id);

//     // const products = await drizzleDb.execute(sql`
//     //   SELECT DISTINCT p.id, p.product_address_name
//     //   FROM ${Product} p
//     //   INNER JOIN ${ProductToCategory} ptc ON p.id = ptc.product_id
//     //   INNER JOIN ${Category} c ON ptc.category_id = c.id
//     //   WHERE c.id IN ${ids}
//     // `);

//     const products = await drizzleDb.execute(sql`
//     SELECT DISTINCT p.*
//     FROM ${Product} p
//     INNER JOIN ${ProductToCategory} ptc ON p.id = ptc.product_id
//     INNER JOIN ${Category} c ON ptc.category_id = c.id
//     WHERE c.id IN ${ids}
//   `);

//     console.log(products);
//   } catch (error) {
//     console.log('[GetAllProductsFromCategoryTree]', error);
//   }
// };
