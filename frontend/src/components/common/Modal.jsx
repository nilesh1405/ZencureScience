import React from "react";
import Button from "./Button";
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-yellow-100 p-6 rounded-lg">
        {children}
        <Button text="Close" onClick={onClose} />
      </div>
    </div>
  );
}
