// Mock leaderboard data with settlement logic
// Settlement Rule: Winners get 1.9x their stake (after 1% fee), losers lose their stake
const leaderboard = [
  {
    id: 1,
    username: "CryptoTrader",
    email: "trader@test.com",
    totalStaked: 1000,
    totalWon: 1520,
    netWinnings: 520,
    ordersPlaced: 15
  },
  {
    id: 2,
    username: "MarketMaker",
    email: "maker@test.com", 
    totalStaked: 800,
    totalWon: 1140,
    netWinnings: 340,
    ordersPlaced: 12
  },
  {
    id: 3,
    username: "BetMaster",
    email: "master@test.com",
    totalStaked: 1200,
    totalWon: 1440,
    netWinnings: 240,
    ordersPlaced: 20
  }
];

const getLeaderboard = (req, res) => {
  // Sort by net winnings descending and take top 3
  const topUsers = leaderboard
    .sort((a, b) => b.netWinnings - a.netWinnings)
    .slice(0, 3);

  res.json({
    success: true,
    data: topUsers,
    settlementRule: "Winners receive 1.9x their stake (after 1% platform fee), losers forfeit their stake"
  });
};

module.exports = {
  getLeaderboard
};
