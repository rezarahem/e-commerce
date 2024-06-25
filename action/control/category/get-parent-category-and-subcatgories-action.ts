'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category } from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';

type InferredCategoryType = typeof Category.$inferSelect;

type CategoryWithSubs = {
  id: number;
  categoryName: string;
  categoryAddressName: string;
  parentId?: number;
  subs: CategoryWithSubs[];
};

export const GetParentCategoryAndSubcategoriesAction = async (
  categoryId: number,
): Promise<{
  success: boolean;
  flatParentCatAndSubs?: InferredCategoryType[];
  errorMessage?: string;
}> => {
  try {
    const result: InferredCategoryType[] = await drizzleDb.execute(
      sql`
      WITH RECURSIVE category_tree AS (
        SELECT
          id,
          category_name,
          category_address_name,
          parent_id
        FROM
          ${Category}
        WHERE
          id = ${categoryId}
        UNION ALL
        SELECT
          c.id,
          c.category_name,
          c.category_address_name,
          c.parent_id
        FROM
          ${Category} c
          INNER JOIN category_tree ct ON ct.id = c.parent_id
      )
      SELECT
        id,
        category_name  AS "categoryName",
        category_address_name AS "categoryAddressName",
        parent_id AS "parentId"
      FROM
        category_tree;
    `,
    );

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
      flatParentCatAndSubs: result,
    };
  } catch (error) {
    console.log('[GetParentCategoryAndSubcategoriesAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};
