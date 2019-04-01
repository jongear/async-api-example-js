const express = require('express');
const todoRoutes = require('./todoRoutes');
const router = express.Router();

router.use('/todos', todoRoutes);

module.exports = router;
