const express = require('express');
const { getRole } = require('../controllers/role');
const protect = require('../middleware/auth');

const router = express.Router();

// GET /role - Returns the on-chain role for the current user or specified address
router.get('/', getRole);

module.exports = router;
