/*
  Warnings:

  - You are about to drop the `PageView` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShareEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageView" DROP CONSTRAINT "PageView_pageId_fkey";

-- DropForeignKey
ALTER TABLE "ShareEvent" DROP CONSTRAINT "ShareEvent_pageId_fkey";

-- DropTable
DROP TABLE "PageView";

-- DropTable
DROP TABLE "ShareEvent";
