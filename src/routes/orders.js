const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT and extract user info
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Check if user is analyst or admin
const checkRole = (req, res, next) => {
  if (req.user.role === 'viewer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only analyst or admin roles can place orders.'
    });
  }
  next();
};

// Mock data
const events = [
  { id: "event1", status: "Open" },
  { id: "event2", status: "Open" },
  { id: "event3", status: "Closed" }
];

let orders = [];
const usedIdempotencyKeys = new Set();

router.post('/', auth, checkRole, (req, res) => {
  try {
    const { eventId, side, stake, idempotencyKey, signature } = req.body;

    // Validate event exists and is not closed
    const event = events.find(e => e.id === eventId);
    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'Event does not exist'
      });
    }

    if (event.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'Event is closed'
      });
    }

    // Validate stake > 0
    if (!stake || stake <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Stake must be greater than 0'
      });
    }

    // Validate side
    if (!side || !['YES', 'NO'].includes(side)) {
      return res.status(400).json({
        success: false,
        message: 'Side must be YES or NO'
      });
    }

    // Check idempotency
    const idempotencyKeyWithUser = `${req.user.sub}_${idempotencyKey}`;
    if (usedIdempotencyKeys.has(idempotencyKeyWithUser)) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate order detected'
      });
    }

    // Apply 1% fee
    const fee = stake * 0.01;
    const netStake = stake - fee;

    // Create order
    const order = {
      id: Date.now().toString(),
      userId: req.user.sub,
      eventId,
      side,
      stake,
      fee,
      netStake,
      signature,
      idempotencyKey,
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    usedIdempotencyKeys.add(idempotencyKeyWithUser);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;