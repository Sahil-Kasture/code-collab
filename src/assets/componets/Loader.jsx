import React from "react";
import "../../loader.css";

const LoaderOverlay = ({ show , messeage , mainMesseage}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm transition-opacity duration-500 ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-background-light dark:bg-background-dark shadow-xl rounded-lg p-8 max-w-sm w-full text-center border border-primary/20 transform transition-all duration-500 scale-100">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <span className="loader"></span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Loading 
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-400">
          {messeage}
        </p>
      </div>
    </div>
  );
};

export default LoaderOverlay;
