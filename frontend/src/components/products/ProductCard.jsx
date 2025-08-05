import React from "react";
import { Link } from "react-router-dom";
import { Star, Plus } from "lucide-react";

const ProductCard = ({ product }) => {
  const onAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    // TODO: Dispatch add to cart action
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-dark-secondary rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group"
    >
      <div className="relative">
        <img
          src={
            product.imageUrl ||
            "https://placehold.co/600x400/2c2c2c/e5e7eb?text=CafeQueue"
          }
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-dark-primary bg-opacity-70 rounded-full px-2 py-1 text-xs font-bold text-dark-accent flex items-center">
          <Star className="w-3 h-3 mr-1" fill="currentColor" />
          <span>{product.averageRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark-text truncate">
          {product.name}
        </h3>
        <p className="text-sm text-dark-text-secondary mb-2">
          {product.category}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-dark-accent">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={onAddToCart}
            className="bg-dark-accent text-dark-primary rounded-full p-2 transform group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
