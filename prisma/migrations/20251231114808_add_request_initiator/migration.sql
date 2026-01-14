-- CreateEnum
CREATE TYPE "RequestInitiator" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "AssetRequest" ADD COLUMN     "initiator" "RequestInitiator" NOT NULL DEFAULT 'USER';
