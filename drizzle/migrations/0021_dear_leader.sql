ALTER TABLE "product_feature_group" RENAME TO "product_features";--> statement-breakpoint
ALTER TABLE "product_feature_pairs" RENAME COLUMN "feature_key" TO "pair_key";--> statement-breakpoint
ALTER TABLE "product_feature_pairs" RENAME COLUMN "feature_value" TO "pair_value";--> statement-breakpoint
ALTER TABLE "product_feature_pairs" ADD COLUMN "pair_id" text NOT NULL;