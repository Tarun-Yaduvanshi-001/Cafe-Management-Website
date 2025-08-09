import express from 'express';
import cloudinary from 'cloudinary';
import Product from './models/Product.js'; 

const router = express.Router();


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = async (base64String) => {
  try {
    const result = await cloudinary.v2.uploader.upload(base64String, {
      folder: 'products',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};


const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;
  
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = `products/${fileName.split('.')[0]}`;
    
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};


router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('rating');

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});


router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('rating');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});


router.post('/products', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      sizes,
      image, 
      isAvailable
    } = req.body;

   
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }

   
    const validCategories = ['coffee', 'tea', 'food', 'dessert'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    if (sizes && sizes.length > 0) {
      const validSizes = ['small', 'medium', 'large', 'extra-large'];
      for (const size of sizes) {
        if (!validSizes.includes(size.name)) {
          return res.status(400).json({
            success: false,
            message: `Invalid size: ${size.name}`
          });
        }

        if (size.price && size.price < 0) {
          return res.status(400).json({
            success: false,
            message: 'Size price cannot be negative'
          });
        }
      }
    }

    let imageUrl = null;


    if (image) {
      try {
      
        if (image.startsWith('data:image/')) {
          imageUrl = await uploadToCloudinary(image);
        } else if (image.startsWith('http')) {
         
          imageUrl = image;
        } else {
        
          const base64WithPrefix = `data:image/jpeg;base64,${image}`;
          imageUrl = await uploadToCloudinary(base64WithPrefix);
        }
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message
        });
      }
    }

    const productData = {
      name: name.trim(),
      description: description?.trim(),
      category,
      price: price || 0,
      sizes: sizes || [],
      image: imageUrl,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});


router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name,
      description,
      category,
      price,
      sizes,
      image,
      isAvailable
    } = req.body;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

   
    if (category) {
      const validCategories = ['coffee', 'tea', 'food', 'dessert'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
    }

 
    if (sizes && sizes.length > 0) {
      const validSizes = ['small', 'medium', 'large', 'extra-large'];
      for (const size of sizes) {
        if (!validSizes.includes(size.name)) {
          return res.status(400).json({
            success: false,
            message: `Invalid size: ${size.name}`
          });
        }
        if (size.price && size.price < 0) {
          return res.status(400).json({
            success: false,
            message: 'Size price cannot be negative'
          });
        }
      }
    }

    let imageUrl = existingProduct.image;

   
    if (image !== undefined) {
      if (image === null || image === '') {
     
        if (existingProduct.image) {
          await deleteFromCloudinary(existingProduct.image);
        }
        imageUrl = null;
      } else {
        try {
        
          if (image.startsWith('data:image/')) {
            imageUrl = await uploadToCloudinary(image);
          } else if (image.startsWith('http')) {
            imageUrl = image;
          } else {
            const base64WithPrefix = `data:image/jpeg;base64,${image}`;
            imageUrl = await uploadToCloudinary(base64WithPrefix);
          }

        
          if (existingProduct.image && existingProduct.image !== imageUrl) {
            await deleteFromCloudinary(existingProduct.image);
          }
        } catch (uploadError) {
          return res.status(400).json({
            success: false,
            message: 'Image upload failed',
            error: uploadError.message
          });
        }
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (sizes !== undefined) updateData.sizes = sizes;
    if (image !== undefined) updateData.image = imageUrl;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('rating');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});


router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

   
    if (product.image) {
      await deleteFromCloudinary(product.image);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

export default router;