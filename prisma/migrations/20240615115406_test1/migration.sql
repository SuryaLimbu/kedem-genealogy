/*
  Warnings:

  - You are about to drop the column `from_person_id` on the `Relationship` table. All the data in the column will be lost.
  - You are about to drop the column `to_person_id` on the `Relationship` table. All the data in the column will be lost.
  - You are about to drop the column `type_id` on the `Relationship` table. All the data in the column will be lost.
  - You are about to drop the `RelationshipType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpouseRelationship` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fromNode` to the `Relationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toNode` to the `Relationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Relationship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'other';

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_from_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_to_person_id_fkey";

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_type_id_fkey";

-- DropForeignKey
ALTER TABLE "SpouseRelationship" DROP CONSTRAINT "SpouseRelationship_from_person_id_fkey";

-- DropForeignKey
ALTER TABLE "SpouseRelationship" DROP CONSTRAINT "SpouseRelationship_to_person_id_fkey";

-- AlterTable
ALTER TABLE "Relationship" DROP COLUMN "from_person_id",
DROP COLUMN "to_person_id",
DROP COLUMN "type_id",
ADD COLUMN     "fromNode" INTEGER NOT NULL,
ADD COLUMN     "toNode" INTEGER NOT NULL,
ADD COLUMN     "type" VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE "RelationshipType";

-- DropTable
DROP TABLE "SpouseRelationship";

-- DropEnum
DROP TYPE "RelationshipStatus";

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_fromNode_fkey" FOREIGN KEY ("fromNode") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_toNode_fkey" FOREIGN KEY ("toNode") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
