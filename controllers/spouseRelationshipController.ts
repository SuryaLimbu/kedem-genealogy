import prisma from '../lib/prisma';

export const createSpouseRelationship = async (data: any) => {
  return await prisma.spouseRelationship.create({
    data,
  });
};

export const getSpouseRelationshipById = async (id: number) => {
  return await prisma.spouseRelationship.findUnique({
    where: { id },
    include: {
      toPerson: true,
    },
  });
};

export const updateSpouseRelationship = async (id: number, data: any) => {
  return await prisma.spouseRelationship.update({
    where: { id },
    data,
  });
};

export const deleteSpouseRelationship = async (id: number) => {
  return await prisma.spouseRelationship.delete({
    where: { id },
  });
};
