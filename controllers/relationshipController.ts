import prisma from "@/lib/prisma";

export const createRelationship = async (data: any) => {
  const { type, from_person_id, to_person_id } = data;
  const relationshipType = await prisma.relationshipType.findUnique({
    where: { type },
  });
  if (!relationshipType) throw new Error("Invalid relationship type");

  return await prisma.relationship.create({
    data: {
      type_id: relationshipType.id,
      from_person_id,
      to_person_id,
    },
  });
};

export const getAllRealtionships = async () => {
  return await prisma.relationship.findMany({
    include: {
      from: true,
      to: true,
    },
  });
};
