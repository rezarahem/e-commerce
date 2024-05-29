ALTER TABLE "product_to_category" DROP CONSTRAINT "product_to_category_product_id_product_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_to_category" ADD CONSTRAINT "product_to_category_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
