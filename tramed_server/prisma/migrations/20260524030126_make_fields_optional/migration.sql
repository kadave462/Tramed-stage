/*
  Warnings:

  - A unique constraint covering the columns `[productCode]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Made the column `productCode` on table `Stock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "productCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productCode_key" ON "Stock"("productCode");
