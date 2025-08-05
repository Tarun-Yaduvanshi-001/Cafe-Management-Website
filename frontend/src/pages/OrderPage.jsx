import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, reset } from "../features/products/productSlice";
import ProductCard from "../components/products/ProductCard";
import Spinner from "../components/common/Spinner";
import { Search, ChevronDown, X } from "lucide-react";

const categories = [
  "All",
  "Coffee",
  "Tea",
  "Beverages",
  "Snacks",
  "Desserts",
  "Bakery",
];
const sortOptions = [
  { name: "Default", value: "" },
  { name: "Price: Low to High", value: "price.asc" },
  { name: "Price: High to Low", value: "price.desc" },
  { name: "Rating: High to Low", value: "averageRating.desc" },
];

const OrderPage = () => {
  const dispatch = useDispatch();
  const { products, page, pages, status } = useSelector(
    (state) => state.products
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    // Reset product state on component unmount
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.keyword = searchTerm;
    if (category !== "All") params.category = category;
    if (sortBy) {
      const [sortField, sortOrder] = sortBy.split(".");
      params.sortBy = sortField;
      params.sortOrder = sortOrder;
    }

    dispatch(getProducts(params));
  }, [dispatch, searchTerm, category, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will trigger the dispatch
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-dark-accent">Our Menu</h1>
        <p className="text-lg text-dark-text-secondary mt-2">
          Find your next favorite treat
        </p>
      </header>

      {/* Filters and Search Bar */}
      <div className="mb-8 p-4 bg-dark-secondary rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <form
          onSubmit={handleSearch}
          className="relative flex-grow w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search for an item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-dark-text rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary"
            size={20}
          />
        </form>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none w-full md:w-40 bg-gray-700 text-dark-text py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-secondary pointer-events-none"
              size={20}
            />
          </div>

          {/* Sort By Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full md:w-48 bg-gray-700 text-dark-text py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-dark-accent"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-secondary pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {status === "loading" && <Spinner />}
      {status === "succeeded" && products.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-dark-text">
            No Products Found
          </h2>
          <p className="text-dark-text-secondary mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
      {status === "succeeded" && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {status === "failed" && (
        <div className="text-center py-16 text-red-400">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2">
            Could not fetch products. Please try again later.
          </p>
        </div>
      )}

      {/* TODO: Pagination Controls */}
    </div>
  );
};

export default OrderPage;
