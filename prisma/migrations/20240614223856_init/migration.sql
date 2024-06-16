/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('married', 'divorced', 'separated');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthdate" TIMESTAMP(3),
    "deathdate" TIMESTAMP(3),
    "birthplace" VARCHAR(100),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "address" VARCHAR(255),
    "facebook" VARCHAR(100),
    "twitter" VARCHAR(100),
    "linkedin" VARCHAR(100),
    "image" VARCHAR(255),
    "current_address" VARCHAR(255),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelationshipType" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "RelationshipType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Relationship" (
    "id" SERIAL NOT NULL,
    "type_id" INTEGER NOT NULL,
    "from_person_id" INTEGER NOT NULL,
    "to_person_id" INTEGER NOT NULL,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpouseRelationship" (
    "id" SERIAL NOT NULL,
    "from_person_id" INTEGER NOT NULL,
    "to_person_id" INTEGER NOT NULL,
    "relationship_status" "RelationshipStatus" NOT NULL,
    "marriage_date" TIMESTAMP(3),
    "marriage_place" VARCHAR(100),
    "spouse_image" VARCHAR(255),
    "spouse_birthplace" VARCHAR(100),

    CONSTRAINT "SpouseRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RelationshipType_type_key" ON "RelationshipType"("type");

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "RelationshipType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_from_person_id_fkey" FOREIGN KEY ("from_person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_to_person_id_fkey" FOREIGN KEY ("to_person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpouseRelationship" ADD CONSTRAINT "SpouseRelationship_from_person_id_fkey" FOREIGN KEY ("from_person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpouseRelationship" ADD CONSTRAINT "SpouseRelationship_to_person_id_fkey" FOREIGN KEY ("to_person_id") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
