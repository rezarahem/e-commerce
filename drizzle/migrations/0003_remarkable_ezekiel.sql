CREATE TABLE IF NOT EXISTS "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoryName" text NOT NULL,
	"categoryAddressName" text NOT NULL,
	"parentId" integer,
	CONSTRAINT "category_categoryName_unique" UNIQUE("categoryName"),
	CONSTRAINT "category_categoryAddressName_unique" UNIQUE("categoryAddressName")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_parentId_category_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
