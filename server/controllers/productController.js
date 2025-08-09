import Product from '../models/product.js';

// No need for a custom wrapper if you handle responses directly.
// If you want to use it, ensure it's imported and used consistently.

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, sizes, image } = req.body;
    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: 'Name, description, category, and price are required.' });
    }

    const newProduct = await Product.create({
      createdBy: req.user.id, // Use ID from verify middleware
      name,
      description,
      category,
      price,
      sizes,
      image,
    });

    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating product.', error: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    // FIX: Added await to execute the query
    const products = await Product.find({ isAvailable: true })
      .populate('createdBy', 'name phone')
      .populate('rating');
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ message: 'Server error getting products.', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name phone')
      .populate('rating');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ message: 'Server error getting product by ID.', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (
      product.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Failed to update product' });
    }
    // FIX: Return the correct variable
    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating product.', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // FIX: Added await and combined find/auth check
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (
      product.createdBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    await Product.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting product.', error: error.message });
  }
};