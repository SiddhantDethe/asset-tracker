/*
  Warnings:

  - You are about to drop the column `serialNo` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Asset` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Asset_serialNo_key";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "serialNo",
DROP COLUMN "status",
ADD COLUMN     "availableCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "totalCount" INTEGER NOT NULL DEFAULT 1;
