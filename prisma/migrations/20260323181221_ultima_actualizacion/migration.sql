/*
  Warnings:

  - You are about to drop the column `location` on the `matches` table. All the data in the column will be lost.
  - You are about to drop the column `team_category` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `league_id` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the `leagues` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[team_name,category_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tournaments" DROP CONSTRAINT "fk_tournaments_league";

-- DropIndex
DROP INDEX "teams_team_name_key";

-- DropIndex
DROP INDEX "idx_tournaments_league";

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "location",
ADD COLUMN     "field_id" BIGINT;

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "player_image_url" TEXT;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "team_category";

-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "league_id";

-- AlterTable
ALTER TABLE "vocalias" ADD COLUMN     "arbitrator_name" TEXT,
ADD COLUMN     "signatures" JSONB;

-- DropTable
DROP TABLE "leagues";

-- CreateTable
CREATE TABLE "fields" (
    "field_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "fields_pkey" PRIMARY KEY ("field_id")
);

-- CreateTable
CREATE TABLE "regulation_articles" (
    "article_id" BIGSERIAL NOT NULL,
    "article_num" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sanction" TEXT NOT NULL,
    "badge_variant" TEXT NOT NULL DEFAULT 'neutral',
    "category" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "regulation_articles_pkey" PRIMARY KEY ("article_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fields_name_key" ON "fields"("name");

-- CreateIndex
CREATE INDEX "idx_matches_field" ON "matches"("field_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_name_category_id_key" ON "teams"("team_name", "category_id");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_matches_field" FOREIGN KEY ("field_id") REFERENCES "fields"("field_id") ON DELETE SET NULL ON UPDATE NO ACTION;
