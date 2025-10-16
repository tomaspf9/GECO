const { prisma } = require('../core/db');

async function getAll() {
  return prisma.company.findMany();
}

async function create(data) {
  return prisma.company.create({ data });
}

module.exports = { getAll, create };
