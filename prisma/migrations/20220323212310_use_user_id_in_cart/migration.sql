/*
  Warnings:

  - You are about to drop the column `ownerAddress` on the `Cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_ownerAddress_fkey";

-- DropIndex
DROP INDEX "Cart_ownerAddress_storeName_key";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "ownerAddress",
ADD COLUMN     "ownerId" INTEGER;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
