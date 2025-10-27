import React from "react";

const ErrorPage = ({ show, onClose, errorMessage }) => {
  if (!show) return null; // completely remove it from DOM when hidden

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-background-dark shadow-xl rounded-lg w-full max-w-md mx-4 p-6 text-center border border-primary/20">
        {/* Icon */}
        <div className="mx-auto bg-red-200 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="material-symbols-outlined text-primary text-3xl">
            error
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-semibold text-black dark:text-black">
          {errorMessage}
        </h3>


        {/* Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex hover:cursor-pointer justify-center rounded-lg border border-transparent bg-red-400 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
