/*
  Warnings:

  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "products_created_at_id_idx" ON "products"("created_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "products_category_created_at_id_idx" ON "products"("category", "created_at" DESC, "id" DESC);
