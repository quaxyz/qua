/*
  Warnings:

  - The values [CONTACT_SELLER,BANK_TRANSFER] on the enum `OrderPaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderPaymentStatus_new" AS ENUM ('PAID', 'UNPAID', 'PAY_LATER');
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" TYPE "OrderPaymentStatus_new" USING ("paymentStatus"::text::"OrderPaymentStatus_new");
ALTER TYPE "OrderPaymentStatus" RENAME TO "OrderPaymentStatus_old";
ALTER TYPE "OrderPaymentStatus_new" RENAME TO "OrderPaymentStatus";
DROP TYPE "OrderPaymentStatus_old";
ALTER TABLE "Order" ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';
COMMIT;
