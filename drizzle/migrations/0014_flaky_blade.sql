CREATE TABLE IF NOT EXISTS "product_to_category" (
	"product_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "product_to_category_product_id_category_id_pk" PRIMARY KEY("product_id","category_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_to_category" ADD CONSTRAINT "product_to_category_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_to_category" ADD CONSTRAINT "product_to_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
