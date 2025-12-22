-- CreateTable
CREATE TABLE "tournament_teams" (
    "tournament_team_id" BIGSERIAL NOT NULL,
    "tournament_id" BIGINT NOT NULL,
    "team_id" BIGINT NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "drawn" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "goals_for" INTEGER NOT NULL DEFAULT 0,
    "goals_against" INTEGER NOT NULL DEFAULT 0,
    "goal_diff" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "tournament_teams_pkey" PRIMARY KEY ("tournament_team_id")
);

-- CreateIndex
CREATE INDEX "tournament_teams_tournament_id_idx" ON "tournament_teams"("tournament_id");

-- CreateIndex
CREATE INDEX "tournament_teams_team_id_idx" ON "tournament_teams"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_tournament_team" ON "tournament_teams"("tournament_id", "team_id");

-- AddForeignKey
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("tournament_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_teams" ADD CONSTRAINT "tournament_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;
