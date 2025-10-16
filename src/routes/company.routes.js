const express = require('express');
const { z } = require('zod');
const { getAll, create } = require('../srv/company.srv');

const router = express.Router();
const schema = z.object({ name: z.string(), cuit: z.string() });

router.get('/', async (_req, res) => res.json(await getAll()));
router.post('/', async (req, res, next) => {
  const valid = schema.safeParse(req.body);
  if (!valid.success) return res.status(400).json(valid.error.flatten());
  try { res.status(201).json(await create(valid.data)); } catch (e) { next(e); }
});

module.exports = { router };
