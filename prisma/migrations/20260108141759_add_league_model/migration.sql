/*
  Warnings:

  - Added the required column `league_id` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "league_id" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "leagues" (
    "league_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("league_id")
);

-- CreateIndex
CREATE INDEX "idx_leagues_active" ON "leagues"("is_active");

-- CreateIndex
CREATE INDEX "idx_tournaments_league" ON "tournaments"("league_id");

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "fk_tournaments_league" FOREIGN KEY ("league_id") REFERENCES "leagues"("league_id") ON DELETE CASCADE ON UPDATE NO ACTION;
