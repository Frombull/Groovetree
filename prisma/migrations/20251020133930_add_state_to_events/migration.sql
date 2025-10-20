-- DropIndex
DROP INDEX "public"."Page_userId_key";

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "state" TEXT;
