/*
  Warnings:

  - A unique constraint covering the columns `[invoiceId,productCode,quantity,unitPrice]` on the table `Sale` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sale_invoiceId_productCode_quantity_unitPrice_key" ON "Sale"("invoiceId", "productCode", "quantity", "unitPrice");
