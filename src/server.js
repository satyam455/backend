const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const orderRoutes = require('./routes/orders');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/orders', orderRoutes);
app.use('/leaderboard', leaderboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'VaultBoard API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});