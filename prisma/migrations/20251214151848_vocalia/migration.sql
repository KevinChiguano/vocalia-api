-- CreateEnum
CREATE TYPE "match_status" AS ENUM ('programado', 'en_curso', 'finalizado', 'suspendido', 'cancelado');

-- CreateEnum
CREATE TYPE "sanction_type" AS ENUM ('amarilla', 'roja_directa', 'doble_amarilla');

-- CreateTable
CREATE TABLE "goals" (
    "goal_id" BIGSERIAL NOT NULL,
    "match_id" BIGINT NOT NULL,
    "player_id" BIGINT NOT NULL,
    "event_time" TIMESTAMPTZ(6) NOT NULL,
    "is_own_goal" BOOLEAN DEFAULT false,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("goal_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "match_id" BIGSERIAL NOT NULL,
    "tournament_id" BIGINT NOT NULL,
    "local_team_id" BIGINT NOT NULL,
    "away_team_id" BIGINT NOT NULL,
    "category" TEXT,
    "stage" TEXT NOT NULL,
    "match_day" INTEGER,
    "match_date" TIMESTAMPTZ(6),
    "location" TEXT,
    "status" "match_status" NOT NULL DEFAULT 'programado',
    "local_score" INTEGER NOT NULL DEFAULT 0,
    "away_score" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "players" (
    "player_id" BIGSERIAL NOT NULL,
    "player_name" TEXT NOT NULL,
    "player_lastname" TEXT,
    "player_number" INTEGER,
    "player_dni" TEXT NOT NULL,
    "team_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "players_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "rol_id" BIGSERIAL NOT NULL,
    "rol_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("rol_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "rol_id" BIGINT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "sanctions" (
    "sanction_id" BIGSERIAL NOT NULL,
    "match_id" BIGINT NOT NULL,
    "player_id" BIGINT NOT NULL,
    "type" "sanction_type" NOT NULL,
    "description" TEXT,
    "event_time" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sanctions_pkey" PRIMARY KEY ("sanction_id")
);

-- CreateTable
CREATE TABLE "substitutions" (
    "substitution_id" BIGSERIAL NOT NULL,
    "match_id" BIGINT NOT NULL,
    "player_out" BIGINT NOT NULL,
    "player_in" BIGINT NOT NULL,
    "event_time" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "substitutions_pkey" PRIMARY KEY ("substitution_id")
);

-- CreateTable
CREATE TABLE "teams" (
    "team_id" BIGSERIAL NOT NULL,
    "team_name" TEXT NOT NULL,
    "team_logo" TEXT,
    "team_category" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "tournament_id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("tournament_id")
);

-- CreateTable
CREATE TABLE "vocalias" (
    "vocalia_id" BIGSERIAL NOT NULL,
    "match_id" BIGINT NOT NULL,
    "local_captain_id" BIGINT,
    "away_captain_id" BIGINT,
    "observations" TEXT,
    "vocalia_data" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vocalias_pkey" PRIMARY KEY ("vocalia_id")
);

-- CreateIndex
CREATE INDEX "idx_goals_match" ON "goals"("match_id");

-- CreateIndex
CREATE INDEX "idx_goals_time" ON "goals"("event_time");

-- CreateIndex
CREATE INDEX "idx_matches_tournament" ON "matches"("tournament_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_player_dni_key" ON "players"("player_dni");

-- CreateIndex
CREATE INDEX "idx_players_team" ON "players"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_rol_name_key" ON "roles"("rol_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- CreateIndex
CREATE INDEX "idx_sanctions_match" ON "sanctions"("match_id");

-- CreateIndex
CREATE INDEX "idx_sanctions_time" ON "sanctions"("event_time");

-- CreateIndex
CREATE INDEX "idx_subs_match" ON "substitutions"("match_id");

-- CreateIndex
CREATE INDEX "idx_subs_time" ON "substitutions"("event_time");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_name_key" ON "teams"("team_name");

-- CreateIndex
CREATE UNIQUE INDEX "vocalias_match_id_key" ON "vocalias"("match_id");

-- CreateIndex
CREATE INDEX "idx_vocalias_match" ON "vocalias"("match_id");

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "fk_goals_match" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "fk_goals_player" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_matches_local_team" FOREIGN KEY ("local_team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_matches_away_team" FOREIGN KEY ("away_team_id") REFERENCES "teams"("team_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "fk_matches_tournament" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("tournament_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "fk_players_team" FOREIGN KEY ("team_id") REFERENCES "teams"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_rol" FOREIGN KEY ("rol_id") REFERENCES "roles"("rol_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sanctions" ADD CONSTRAINT "fk_sanctions_match" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sanctions" ADD CONSTRAINT "fk_sanctions_player" FOREIGN KEY ("player_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "fk_subs_in" FOREIGN KEY ("player_in") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "fk_subs_match" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "substitutions" ADD CONSTRAINT "fk_subs_out" FOREIGN KEY ("player_out") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vocalias" ADD CONSTRAINT "fk_vocalias_away_cap" FOREIGN KEY ("away_captain_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vocalias" ADD CONSTRAINT "fk_vocalias_local_cap" FOREIGN KEY ("local_captain_id") REFERENCES "players"("player_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vocalias" ADD CONSTRAINT "fk_vocalias_match" FOREIGN KEY ("match_id") REFERENCES "matches"("match_id") ON DELETE CASCADE ON UPDATE NO ACTION;
