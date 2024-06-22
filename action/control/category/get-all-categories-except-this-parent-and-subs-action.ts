'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { Category } from '@/drizzle/schema';
import { sql } from 'drizzle-orm';

type InferdCategoryType = typeof Category.$inferSelect;

type CategoryWithSubs = {
  id: number;
  categoryName: string;
  categoryAddressName: string;
  parentId?: number;
  subs: CategoryWithSubs[];
};

export const GetAllCategoriesExceptThisParentAndSubsAction = async (
  categoryId: number,
): Promise<{
  success: boolean;
  flatParentCatAndSubs?: InferdCategoryType[];
  errorMessage?: string;
}> => {
  try {
    const result: InferdCategoryType[] = await drizzleDb.execute(
      sql`
      WITH RECURSIVE excluded_category_tree AS (
        SELECT
          id,
          category_name,
          category_address_name,
          parent_id
        FROM
          ${Category}
        WHERE
          id = ${categoryId} -- the category to be excluded
        UNION ALL
        SELECT
          c.id,
          c.category_name,
          c.category_address_name,
          c.parent_id
        FROM
          ${Category} c
          INNER JOIN excluded_category_tree ect ON ect.id = c.parent_id
        )
        SELECT
          id,
          category_name AS "categoryName",
          category_address_name AS "categoryAddressName",
          parent_id AS "parentId"
        FROM
          ${Category}
        WHERE
          id NOT IN (SELECT id FROM excluded_category_tree);
        `,
    );

    console.log(result);

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
    console.log('[GetAllCategoriesExceptThisParentAndSubsAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};
