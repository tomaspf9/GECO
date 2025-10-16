const { prisma } = require('../src/core/db');
const bcrypt = require('bcrypt');

async function main() {
  const hash = await bcrypt.hash('Admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@geco.com' },
    update: {},
    create: { email: 'admin@geco.com', password: hash, role: 'admin' },
  });
  console.log('✅ Admin creado: admin@geco.com / Admin123');
}
main().catch(console.error).finally(() => prisma.$disconnect());
