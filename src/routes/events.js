const express = require('express');
const { getEvents } = require('../controllers/events');

const router = express.Router();

router.get('/', getEvents);

module.exports = router;
