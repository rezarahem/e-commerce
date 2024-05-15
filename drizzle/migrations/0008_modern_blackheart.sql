CREATE TABLE IF NOT EXISTS "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_category_id" integer
);
--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_parent_id_category_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_parent_category_id_category_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN IF EXISTS "parent_id";