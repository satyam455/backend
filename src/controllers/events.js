const events = [
  {
    id: "event1",
    title: "Will Bitcoin reach $100k by end of 2024?",
    description: "Prediction market for Bitcoin price target",
    status: "Open",
    endDate: "2024-12-31T23:59:59Z"
  },
  {
    id: "event2", 
    title: "Will AI achieve AGI by 2025?",
    description: "Artificial General Intelligence milestone prediction",
    status: "Open",
    endDate: "2025-12-31T23:59:59Z"
  },
  {
    id: "event3",
    title: "Will SpaceX land on Mars by 2026?",
    description: "Mars mission prediction market",
    status: "Closed",
    endDate: "2026-12-31T23:59:59Z"
  }
];

const getEvents = (req, res) => {
  res.json({
    success: true,
    data: events
  });
};

module.exports = {
  getEvents
};
