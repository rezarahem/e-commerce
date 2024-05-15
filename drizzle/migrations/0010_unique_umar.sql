CREATE TABLE IF NOT EXISTS "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer NOT NULL,
	CONSTRAINT "subcategories_parent_id_unique" UNIQUE("parent_id")
);
--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "subs_id" integer;