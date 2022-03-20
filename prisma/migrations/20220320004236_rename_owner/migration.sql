/*
  Warnings:

  - You are about to drop the column `owner` on the `Store` table. All the data in the column will be lost.
  - Added the required column `owner_old` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" 
RENAME COLUMN "owner" TO "owner_old";
