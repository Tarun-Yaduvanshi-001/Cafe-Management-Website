import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductReview } from "../../features/products/productSlice";
import { Star, X } from "lucide-react";

const RatingModal = ({ isOpen, onClose, productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addProductReview({ productId, rating, comment }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-dark-secondary rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dark-text-secondary hover:text-dark-text"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-dark-accent">
          Rate this Product
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-dark-text-secondary mb-2">
              Your Rating
            </label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    className="text-2xl"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        ratingValue <= (hover || rating)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                      fill="currentColor"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-dark-text-secondary mb-2"
            >
              Your Comment (optional)
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
              placeholder="Tell us what you thought..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-dark-accent text-dark-primary font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
