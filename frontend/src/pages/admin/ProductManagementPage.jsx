import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../features/admin/adminSlice";
import Spinner from "../../components/common/Spinner";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import ProductFormModal from "../../components/admin/ProductFormModal";

const ProductManagementPage = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.admin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      dispatch(updateProduct({ ...productData, _id: editingProduct._id }));
    } else {
      dispatch(createProduct(productData));
    }
    handleCloseModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  };

  if (status === "loading" && products.length === 0) return <Spinner />;

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark-text">
          Product Management
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-dark-accent text-dark-primary font-bold py-2 px-4 rounded-lg hover:opacity-90"
        >
          <PlusCircle size={20} className="mr-2" /> Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-700 hover:bg-gray-800"
              >
                <td className="p-4 font-semibold">{product.name}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">${product.price.toFixed(2)}</td>
                <td className="p-4 flex gap-4">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default ProductManagementPage;
