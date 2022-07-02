/*
  Warnings:

  - You are about to drop the column `imageId` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_imageId_fkey";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "imageId",
ADD COLUMN     "image" TEXT;

-- DropTable
DROP TABLE "Image";
