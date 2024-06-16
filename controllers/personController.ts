import prisma from "@/lib/prisma";

export const createPersonWithParent = async (parentId: number, data: any) => {
  const newPerson = await prisma.person.create({ data });
  await prisma.relationship.create({
    data: {
      type: "parent",
      fromNode: parentId,
      toNode: newPerson.id,
    },
  });
};
export const createPersonWithSpouse = async (parentId: number, data: any) => {
  const newPerson = await prisma.person.create({ data });
  await prisma.relationship.create({
    data: {
      type: "spouse",
      fromNode: parentId,
      toNode: newPerson.id,
    },
  });
};


export const getAllPersons = async (res: Response) => {
  return await prisma.person.findMany({
    include: {
      fromNode: true,
      toNode: true,
    },
  });
};
