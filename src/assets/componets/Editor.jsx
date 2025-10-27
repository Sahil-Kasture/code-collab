import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import socket from "../scripts/sockets";
import { useAuth } from "../context/JoinContext";
import { useEditor } from "../context/EditorContext";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness.js";
import LoaderOverlay from "./Loader";

function Sandbox() {
  const [loading, setLoading] = useState(false);
  const initializedRef = useRef(false);

  const { file, roomId, canEdit, user, isAdmin } = useAuth();
  const {
    editorRef,
    monacoRef,
    ydocRef,
    bindingRef,
    awarenessRef,
    showEditor,
    setCode,
    isDarkMode,
  } = useEditor();
  const [height, setHeight] = useState("85vh");

  useEffect(() => {
    const handleResize = () => setHeight(`${window.innerHeight * 0.87}px`);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);

    const ydoc = new Y.Doc();
    const awareness = new Awareness(ydoc);
    const ytext = ydoc.getText("monaco");

    ydocRef.current = ydoc;
    awarenessRef.current = awareness;

    const handleYjsInit = ({ roomId: r, update }) => {
      if (r !== roomId) return;
      Y.applyUpdate(ydoc, new Uint8Array(update));
      if (editorRef.current && !bindingRef.current) createBinding(editorRef.current, ydoc, awareness);
      initializedRef.current = true;
    };

    const handleYjsUpdate = ({ roomId: r, update }) => {
      if (r !== roomId) return;
      Y.applyUpdate(ydoc, new Uint8Array(update));
      if (editorRef.current && !bindingRef.current) createBinding(editorRef.current, ydoc, awareness);
    };

    const handleAwarenessUpdate = ({ roomId: r, update }) => {
      if (r !== roomId) return;
      applyAwarenessUpdate(awareness, new Uint8Array(update));
    };

    const handleLocalUpdate = (update) => {
      if (!initializedRef.current) return;
      socket.emit("yjs-update", { roomId, update, from: user });
      setCode(ydoc.getText("monaco").toString());
    };

    const handleLocalAwareness = ({ added, updated, removed }) => {
      const changedClients = [...added, ...updated, ...removed];
      const upd = encodeAwarenessUpdate(awareness, changedClients);
      socket.emit("awareness-update", { roomId, update: upd, changedClients });
    };

    socket.on("yjs-init", handleYjsInit);
    socket.on("yjs-update", handleYjsUpdate);
    socket.on("awareness-update", handleAwarenessUpdate);
    ydoc.on("update", handleLocalUpdate);
    awareness.on("update", handleLocalAwareness);

    return () => {
      socket.off("yjs-init", handleYjsInit);
      socket.off("yjs-update", handleYjsUpdate);
      socket.off("awareness-update", handleAwarenessUpdate);
      ydoc.off("update", handleLocalUpdate);
      awareness.off("update", handleLocalAwareness);
      if (bindingRef.current) bindingRef.current.destroy();
      ydoc.destroy();
      initializedRef.current = false;
    };
  }, [roomId]);

  function createBinding(editor, ydoc, awareness) {
    if (bindingRef.current) bindingRef.current.destroy();
    bindingRef.current = new MonacoBinding(
      ydoc.getText("monaco"),
      editor.getModel(),
      new Set([editor]),
      awareness
    );
    initializedRef.current = true;
  }

  function afterMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    if (ydocRef.current && !bindingRef.current)
      createBinding(editor, ydocRef.current, awarenessRef.current);
    setLoading(false);
  }

  if (!showEditor) return null;

  return (
    <div className="flex flex-col w-full h-full border p-1 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <Editor
        height={height}
        width="100%"
        theme={isDarkMode ? "vs-dark" : "vs"}
        path={file.name}
        language={file.language}
        defaultValue=""
        onMount={afterMount}
        options={{
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: true,
          quickSuggestions: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          readOnly: !(canEdit || isAdmin),
        }}
      />
      <LoaderOverlay show={loading} />
    </div>
  );
}

export default Sandbox;
