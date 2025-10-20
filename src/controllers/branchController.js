const mockData = require('../utils/mockData');

// Get all branches
exports.getBranches = (req, res) => {
  // Enhance branches with client name for frontend display
  const branchesWithClientInfo = mockData.branches.map(branch => {
    const client = mockData.clients.find(c => c._id.toString() === branch.clientId.toString());
    return {
      ...branch,
      clientName: client ? client.name : 'Unknown Client'
    };
  });

  res.json({
    success: true,
    count: branchesWithClientInfo.length,
    data: branchesWithClientInfo
  });
};

// Get single branch
exports.getBranch = (req, res) => {
  const branch = mockData.branches.find(b => b._id.toString() === req.params.id);

  if (!branch) {
    return res.status(404).json({
      success: false,
      message: 'Branch not found'
    });
  }

  // Add client info
  const client = mockData.clients.find(c => c._id.toString() === branch.clientId.toString());
  const branchWithClientInfo = {
    ...branch,
    clientName: client ? client.name : 'Unknown Client'
  };

  res.json({
    success: true,
    data: branchWithClientInfo
  });
};

// Create branch
exports.createBranch = (req, res) => {
  const newBranch = {
    _id: require('mongoose').Types.ObjectId(),
    ...req.body,
    createdAt: new Date()
  };

  mockData.branches.push(newBranch);

  res.status(201).json({
    success: true,
    data: newBranch
  });
};

// Update branch
exports.updateBranch = (req, res) => {
  const index = mockData.branches.findIndex(b => b._id.toString() === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Branch not found'
    });
  }

  mockData.branches[index] = {
    ...mockData.branches[index],
    ...req.body,
    _id: mockData.branches[index]._id // Ensure ID doesn't change
  };

  res.json({
    success: true,
    data: mockData.branches[index]
  });
};

// Delete branch
exports.deleteBranch = (req, res) => {
  const index = mockData.branches.findIndex(b => b._id.toString() === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Branch not found'
    });
  }

  mockData.branches.splice(index, 1);

  res.json({
    success: true,
    data: {}
  });
};
