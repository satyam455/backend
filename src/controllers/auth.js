const jwt = require('jsonwebtoken');

const users = [
  { id: 1, email: 'admin@test.com', password: 'admin123', role: 'admin' },
  { id: 2, email: 'analyst@test.com', password: 'analyst123', role: 'analyst' },
  { id: 3, email: 'viewer@test.com', password: 'viewer123', role: 'viewer' },
  { id: 4, email: 'sepolia@test.com', password: 'sepolia123', role: 'admin' }
];

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { 
        sub: user.id, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  login
};