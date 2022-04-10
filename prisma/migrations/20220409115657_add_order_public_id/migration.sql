-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "publicId" TEXT,
ALTER COLUMN "customerDetails" DROP NOT NULL;
