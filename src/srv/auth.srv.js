const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../core/db');

const sign = (payload, exp) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp });

async function register({ email, password }) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hash } });
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) throw new Error('Credenciales inválidas');

  return {
    accessToken: sign({ sub: user.id, role: user.role }, '15m'),
    refreshToken: sign({ sub: user.id }, '7d'),
  };
}

module.exports = { register, login };
