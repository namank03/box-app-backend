const Material = require('../models/Material');

// Get all materials
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single material
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create material
exports.createMaterial = async (req, res) => {
  try {
    const { name, unit, currentStock, lowStockThreshold, description } = req.body;

    // Validation
    if (!name || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Name and unit are required'
      });
    }

    if (currentStock != null && (isNaN(Number(currentStock)) || Number(currentStock) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'currentStock must be a non-negative number'
      });
    }

    if (lowStockThreshold != null && (isNaN(Number(lowStockThreshold)) || Number(lowStockThreshold) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'lowStockThreshold must be a non-negative number'
      });
    }

    const materialData = {
      name: name.trim(),
      unit,
      description: description || '',
      currentStock: Number(currentStock ?? 0),
      lowStockThreshold: Number(lowStockThreshold ?? 10)
    };

    const newMaterial = await Material.create(materialData);

    res.status(201).json({
      success: true,
      data: newMaterial
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update material
exports.updateMaterial = async (req, res) => {
  try {
    const { name, unit, currentStock, lowStockThreshold, description } = req.body;

    // Validation
    if (name != null && !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    if (unit != null && !String(unit).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Unit cannot be empty'
      });
    }

    if (currentStock != null && (isNaN(Number(currentStock)) || Number(currentStock) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'currentStock must be a non-negative number'
      });
    }

    if (lowStockThreshold != null && (isNaN(Number(lowStockThreshold)) || Number(lowStockThreshold) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'lowStockThreshold must be a non-negative number'
      });
    }

    const updateData = {};
    if (name != null) updateData.name = name.trim();
    if (unit != null) updateData.unit = unit;
    if (description != null) updateData.description = description;
    if (currentStock != null) updateData.currentStock = Number(currentStock);
    if (lowStockThreshold != null) updateData.lowStockThreshold = Number(lowStockThreshold);

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Material deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
