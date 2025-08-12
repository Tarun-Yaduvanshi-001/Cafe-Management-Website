import Product from '../models/product.js';

export const getAllProduct = async (req, res) => {
  try {
    // FIX: Remove the { isAvailable: true } filter to send ALL products
    const products = await Product.find({})
      .populate('createdBy', 'name phone');

    return res.status(200).json({ success: true, products: products });
  } catch (error)
{
    console.error("Error in getAllProduct:", error);
    return res.status(500).json({ message: 'Server error getting products.', error: error.message });
  }
};

// This function can be used by the admin to get ALL products (including unavailable ones)
export const getAllAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, menu: products });
  } catch (error) {
    console.error("Error in getAllAdminProducts:", error);
    return res.status(500).json({ message: 'Server error getting admin products.', error: error.message });
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, isAvailable } = req.body;
    if (!name || !description || !category || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newProduct = await Product.create({
      createdBy: req.user.id,
      name,
      description,
      category,
      price,
      isAvailable,
    });
    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error in createProduct:", error);
    return res.status(500).json({ message: 'Server error creating product.', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Failed to update product' });
    }
    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return res.status(500).json({ message: 'Server error updating product.', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return res.status(500).json({ message: 'Server error deleting product.', error: error.message });
  }
};