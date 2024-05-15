ALTER TABLE "category" RENAME COLUMN "categoryName" TO "category_name";--> statement-breakpoint
ALTER TABLE "category" RENAME COLUMN "categoryAddressName" TO "category_address_name";--> statement-breakpoint
ALTER TABLE "category" RENAME COLUMN "parentId" TO "parent_id";--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_parentId_category_id_fk";
