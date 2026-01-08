/*
  Warnings:

  - You are about to drop the column `completed` on the `Todo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "completed",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';
