/*
  Warnings:

  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `owner_old` on the `Store` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId",
ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT E'UNFULFILLED',
ALTER COLUMN "paymentStatus" SET DEFAULT E'UNPAID';

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "owner_old";
