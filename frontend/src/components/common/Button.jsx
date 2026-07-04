import React from "react";

export default function Button({ text: text, onClick: onClick }) {
  return (
    <button
      className="w-full sm:w-auto bg-yellow-300 hover:bg-yellow-600 hover:text-white rounded px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
