/*
  Warnings:

  - You are about to drop the column `hash` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_hash_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "hash";
