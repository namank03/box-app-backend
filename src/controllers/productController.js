const Product = require('../models/Product');
const Material = require('../models/Material');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get only product materials (BOM) for a product
exports.getProductMaterials = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      count: product.materials.length,
      data: product.materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { materials, ...productData } = req.body;

    // Validation
    if (!productData.name || !productData.description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }

    if (productData.price != null && (isNaN(Number(productData.price)) || Number(productData.price) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number'
      });
    }

    // Validate materials if provided
    if (materials && Array.isArray(materials)) {
      for (const material of materials) {
        if (!material.materialId || !material.quantity || !material.unit) {
          return res.status(400).json({
            success: false,
            message: 'Each material must have materialId, quantity, and unit'
          });
        }

        // Verify material exists
        const materialExists = await Material.findById(material.materialId);
        if (!materialExists) {
          return res.status(400).json({
            success: false,
            message: `Material with ID ${material.materialId} not found`
          });
        }

        // Add material name and unit to the material object
        material.materialName = materialExists.name;
        material.unit = materialExists.unit;
      }
    }

    const product = new Product({
      ...productData,
      materials: materials || []
    });

    const newProduct = await product.save();

    res.status(201).json({
      success: true,
      data: newProduct
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

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { materials, ...productData } = req.body;

    // Validation
    if (productData.name != null && !String(productData.name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    if (productData.price != null && (isNaN(Number(productData.price)) || Number(productData.price) < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number'
      });
    }

    // Validate materials if provided
    if (materials && Array.isArray(materials)) {
      for (const material of materials) {
        if (!material.materialId || !material.quantity || !material.unit) {
          return res.status(400).json({
            success: false,
            message: 'Each material must have materialId, quantity, and unit'
          });
        }

        // Verify material exists
        const materialExists = await Material.findById(material.materialId);
        if (!materialExists) {
          return res.status(400).json({
            success: false,
            message: `Material with ID ${material.materialId} not found`
          });
        }

        // Add material name and unit to the material object
        material.materialName = materialExists.name;
        material.unit = materialExists.unit;
      }
    }

    const updateData = { ...productData };
    if (materials) {
      updateData.materials = materials;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
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

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {},
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
