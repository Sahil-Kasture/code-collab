// src/context/EditorContext.js
import { createContext, useContext, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  // Refs for Monaco, Yjs, and awareness
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const ydocRef = useRef(null);
  const bindingRef = useRef(null);
  const awarenessRef = useRef(null);

  // States for UI and meta
  const [showEditor, setShowEditor] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // Get theme from ThemeContext
  const { isDarkMode } = useTheme();

  return (
    <EditorContext.Provider
      value={{
        editorRef,
        monacoRef,
        ydocRef,
        bindingRef,
        awarenessRef,
        showEditor,
        setShowEditor,
        language,
        setLanguage,
        code,
        setCode,
        isDarkMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
