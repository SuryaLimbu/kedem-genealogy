import prisma from "@/lib/prisma";
export const createRelationshipType = async (data: any) => {
  try {
    return await prisma.relationshipType.create({
      data,
    });
  } catch (err) {
    console.log(err);
  }
};
