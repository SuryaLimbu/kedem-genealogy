/*
  Warnings:

  - You are about to drop the column `facebook` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "facebook",
DROP COLUMN "linkedin",
DROP COLUMN "twitter",
ADD COLUMN     "deathPlace" VARCHAR(255),
ALTER COLUMN "birthplace" SET DATA TYPE VARCHAR(255);
