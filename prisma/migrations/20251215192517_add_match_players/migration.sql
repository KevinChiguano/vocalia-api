-- CreateTable
CREATE TABLE "match_players" (
    "match_player_id" BIGSERIAL NOT NULL,
    "match_id" BIGINT NOT NULL,
    "player_id" BIGINT NOT NULL,
    "team_id" BIGINT NOT NULL,
    "is_starting" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("match_player_id")
);

-- CreateIndex
CREATE INDEX "idx_match_players_match" ON "match_players"("match_id");

-- CreateIndex
CREATE INDEX "idx_match_players_team" ON "match_players"("team_id");

-- CreateIndex
CREATE INDEX "idx_match_players_player" ON "match_players"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_match_player" ON "match_players"("match_id", "player_id");

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;
