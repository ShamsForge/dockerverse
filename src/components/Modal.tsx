"use client";
import React from "react";

type ModalProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
