import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-5xl md:text-7xl font-bold text-dark-accent mb-4">
          Welcome to CafeQueue
        </h1>
        <p className="text-lg md:text-xl text-dark-text-secondary mb-8 max-w-2xl mx-auto">
          Your daily brew, simplified. Skip the line and get your favorite
          coffee and snacks faster than ever.
        </p>
        <Link
          to="/order"
          className="bg-dark-accent text-dark-primary font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
