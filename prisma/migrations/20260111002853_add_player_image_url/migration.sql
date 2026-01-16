/*
  Warnings:

  - You are about to drop the column `team_category` on the `teams` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "team_category";
