const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./core/errors');
const { router: authRouter } = require('./routes/auth.routes');
const { router: companyRouter } = require('./routes/company.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/companies', companyRouter);
app.use(errorHandler);

module.exports = app;
