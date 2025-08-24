const blockchainService = require('../services/blockchain');

const getRole = async (req, res) => {
  try {
    // Get user address from query parameter or JWT
    const userAddress = req.query.address || req.user?.address;
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        message: 'User address is required'
      });
    }

    // Validate Ethereum address format
    if (!userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum address format'
      });
    }

    // Get role from blockchain
    const roleNumber = await blockchainService.getRoleFromBlockchain(userAddress);
    const roleString = blockchainService.roleToString(roleNumber);

    res.json({
      success: true,
      data: {
        address: userAddress,
        role: roleNumber,
        roleString: roleString
      }
    });
  } catch (error) {
    console.error('Error in getRole:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get role from blockchain'
    });
  }
};

module.exports = {
  getRole
};
