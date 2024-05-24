CREATE TABLE IF NOT EXISTS "product_feature_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_name" text NOT NULL,
	"product_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_feature_pairs" (
	"id" serial PRIMARY KEY NOT NULL,
	"feature_key" text NOT NULL,
	"feature_value" text NOT NULL,
	"product_feature_group_id" integer
);
--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "product_images" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "product_images" DROP COLUMN IF EXISTS "updated_at";