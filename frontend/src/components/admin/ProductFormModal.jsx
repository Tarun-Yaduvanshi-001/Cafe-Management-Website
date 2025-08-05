import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const categories = [
  "Coffee",
  "Tea",
  "Beverages",
  "Snacks",
  "Desserts",
  "Bakery",
];

const ProductFormModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Coffee",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "Coffee",
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "Coffee",
        description: "",
        imageUrl: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-secondary rounded-lg shadow-xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-text-secondary hover:text-dark-text"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-dark-accent">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-dark-text-secondary mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label
                htmlFor="price"
                className="block text-dark-text-secondary mb-1"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
                required
                step="0.01"
              />
            </div>
            <div className="w-1/2">
              <label
                htmlFor="category"
                className="block text-dark-text-secondary mb-1"
              >
                Category
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-dark-text-secondary mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-dark-text-secondary mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-dark-accent text-dark-primary font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
