/*
  Warnings:

  - A unique constraint covering the columns `[invoiceId,productCode]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sale_invoiceId_productCode_key" ON "Sale"("invoiceId", "productCode");
