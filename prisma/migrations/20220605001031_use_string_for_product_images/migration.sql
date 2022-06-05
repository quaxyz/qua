-- DropIndex
DROP INDEX "Image_hash_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "newImages" TEXT[];
