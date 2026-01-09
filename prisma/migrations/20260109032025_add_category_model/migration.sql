-- AlterTable
ALTER TABLE "players" ADD COLUMN     "category_id" BIGINT;

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "category_id" BIGINT;

-- AlterTable
ALTER TABLE "tournament_teams" ADD COLUMN     "category_id" BIGINT;

-- CreateTable
CREATE TABLE "categories" (
    "category_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "idx_players_category" ON "players"("category_id");

-- CreateIndex
CREATE INDEX "idx_teams_category" ON "teams"("category_id");

-- CreateIndex
CREATE INDEX "idx_tournament_teams_category" ON "tournament_teams"("category_id");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "fk_players_category" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "fk_teams_category" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tournament_teams" ADD CONSTRAINT "fk_tournament_teams_category" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE SET NULL ON UPDATE NO ACTION;
