/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,storeName]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Made the column `ownerId` on table `Cart` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_ownerId_fkey";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_ownerId_storeName_key" ON "Cart"("ownerId", "storeName");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
