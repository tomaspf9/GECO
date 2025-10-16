const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { prisma } = require('../core/db');
const { register, login } = require('../srv/auth.srv');

const router = express.Router();
const credsSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const refreshSchema = z.object({ refreshToken: z.string().min(10) });

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.flatten());
  req.body = result.data;
  next();
};

router.post('/register', validate(credsSchema), async (req, res, next) => {
  try { res.status(201).json(await register(req.body)); } catch (e) { next(e); }
});
router.post('/login', validate(credsSchema), async (req, res, next) => {
  try { res.json(await login(req.body)); } catch (e) { next(e); }
});
router.post('/refresh', validate(refreshSchema), async (req, res) => {
  try {
    const payload = jwt.verify(req.body.refreshToken, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = { router };
