const blockchainService = require('../services/blockchain');

const checkBlockchainRole = async (req, res, next) => {
  try {
    // For this demo, we'll use a mapping of user IDs to Ethereum addresses
    // In a real app, users would connect their wallets
    const userAddressMap = {
      1: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // admin
      2: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // analyst  
      3: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', // viewer
      4: '0xB4d1cC3386a83c70972E9f9095dDB9D494BF7EAE'  // your sepolia address - admin
    };

    const userAddress = userAddressMap[req.user.sub];
    
    if (!userAddress) {
      return res.status(400).json({
        success: false,
        message: 'User address not found in mapping'
      });
    }

    // Get role from blockchain
    const blockchainRole = await blockchainService.getRoleFromBlockchain(userAddress);
    const blockchainRoleString = blockchainService.roleToString(blockchainRole);

    // Attach blockchain info to request
    req.blockchainRole = blockchainRole;
    req.blockchainRoleString = blockchainRoleString;
    req.userAddress = userAddress;

    console.log(`User ${req.user.sub} has blockchain role: ${blockchainRoleString} (${blockchainRole})`);
    
    next();
  } catch (error) {
    console.error('Blockchain role check failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to verify role on blockchain'
    });
  }
};

const requireAnalystOrAdmin = async (req, res, next) => {
  await checkBlockchainRole(req, res, () => {
    if (req.blockchainRole === 0) { // viewer
      return res.status(403).json({
        success: false,
        message: 'Viewers cannot place orders (verified on-chain)'
      });
    }
    next();
  });
};

module.exports = {
  checkBlockchainRole,
  requireAnalystOrAdmin
};
