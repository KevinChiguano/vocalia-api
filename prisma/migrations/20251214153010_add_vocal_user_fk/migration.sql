/*
  Warnings:

  - Added the required column `vocal_user_id` to the `vocalias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vocalias" ADD COLUMN     "vocal_user_id" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "vocalias_vocal_user_id_idx" ON "vocalias"("vocal_user_id");

-- AddForeignKey
ALTER TABLE "vocalias" ADD CONSTRAINT "fk_vocalias_vocal_user" FOREIGN KEY ("vocal_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
