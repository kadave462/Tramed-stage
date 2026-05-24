/*
  Warnings:

  - Added the required column `costPrice` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "costPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "invoiceId" INTEGER NOT NULL,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL;
