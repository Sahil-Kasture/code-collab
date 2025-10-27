import React from "react";
import { CopyButton } from "../ui/Buttons";

function Code(props) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(props.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 300);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Invitation Code:</span>
            <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{props.code}</span>
            <button
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative"
                onClick={handleCopy}
            >
                <span
                    className={`material-icons hover:cursor-pointer text-base transition-transform duration-300 ${
                        copied ? "scale-80 text-blue-600 dark:text-blue-400" : ""
                    }`}
                >
                    content_copy
                </span>
                {copied && (
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded shadow transition-opacity duration-300 opacity-100">
                        Copied!
                    </span>
                )}
            </button>
        </div>
    )
}
export default Code;