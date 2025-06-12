"use client";
import { useEffect, useRef, ReactNode } from "react";

type ModalPorps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  handleSave: () => void;
  isDisabled: boolean;
};
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  handleSave,
  isDisabled,
}: ModalPorps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(isDisabled);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
        <button
          disabled={isDisabled}
          onClick={handleSave}
          className={`w-full py-3 mt-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black 
      transition ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
      }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}
