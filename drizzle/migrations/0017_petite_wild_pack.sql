ALTER TABLE "product" ADD COLUMN "product_address_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "product_description" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "special_price" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "inventory_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "buy_limit" integer NOT NULL;