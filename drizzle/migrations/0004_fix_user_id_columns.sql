-- Drop existing constraints if they exist
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_user_id_user_id_fk";
ALTER TABLE "tags" DROP CONSTRAINT IF EXISTS "tags_user_id_user_id_fk";

-- Drop columns if they exist
ALTER TABLE "categories" DROP COLUMN IF EXISTS "user_id";
ALTER TABLE "tags" DROP COLUMN IF EXISTS "user_id";

-- Add columns with default value (using a placeholder user ID, you may need to adjust this)
-- For now, using a simple approach: make them nullable, add the column, then populate
ALTER TABLE "categories" ADD COLUMN "user_id" text DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE "tags" ADD COLUMN "user_id" text DEFAULT '00000000-0000-0000-0000-000000000000';

-- Add foreign key constraints
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade;

-- Update the columns to NOT NULL
ALTER TABLE "categories" ALTER COLUMN "user_id" SET NOT NULL;
ALTER TABLE "tags" ALTER COLUMN "user_id" SET NOT NULL;
