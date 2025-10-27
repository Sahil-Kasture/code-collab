import React, { useEffect, useState } from "react";
import { useAuth } from "../context/JoinContext";
import { useTheme } from "../context/ThemeContext";
import socket from "../scripts/sockets";
import LoaderOverlay from "./Loader";
import Code from "./Code";

const Header = () => {
  const { file, setLang, roomId, isPublic, isAdmin, rightPanel, setRightPanel } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (e) => {
    const lang = e.target.value;
    setLang(lang);
    socket.emit("changeLang", { roomId, lang });
  };

  useEffect(() => {
    const handleUpdateLang = (lang) => setLang(lang);
    socket.off("updateLang").on("updateLang", handleUpdateLang);
    return () => socket.off("updateLang", handleUpdateLang);
  }, [setLang]);

  const runCode = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="border-b w-full p-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex flex-row justify-between sm:justify-start w-full sm:w-fit gap-3 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Code Collab Logo" className="w-8 h-8" />
            <h1 className="text-2xl text-black dark:text-white font-bold">Code Collab</h1>
          </div>
          {isPublic && <Code code={roomId} />}
        </div>

        <div className="flex flex-wrap justify-end gap-3 items-center w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="material-icons text-gray-600 dark:text-gray-300">
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setRightPanel(!rightPanel)}
          >
            <span className="material-icons text-gray-600 dark:text-gray-300">
              {rightPanel ? "visibility_off" : "visibility"}
            </span>
          </button>
           
          <button
            onClick={runCode}
            disabled={loading}
            className={`px-4 py-2 rounded text-white transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            }`}
          >
            {loading ? "Running..." : "Run"}
          </button>

          <select
            disabled={!isAdmin}
            onChange={handleSelect}
            value={file.language}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {["javascript", "css", "html", "python", "c", "cpp"].map((lang) => (
              <option key={lang} value={lang} className="bg-white dark:bg-gray-700 text-black dark:text-white">
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </header>

      <LoaderOverlay show={loading} />
    </div>
  );
};

export default Header;
