"use client";
import React, { useState } from "react";
import Modal from "./Modal";

type CreateContainerModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; image: string; port: string }) => void;
  availableImages?: string[];
};

const DEFAULT_IMAGES = ["alpine:latest", "node:18", "postgres:15", "nginx:latest"];

export default function CreateContainerModal({
  open,
  onClose,
  onSubmit,
  availableImages = DEFAULT_IMAGES,
}: CreateContainerModalProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(availableImages[0] || "");
  const [port, setPort] = useState("8080");

  const handleSubmit = () => {
    if (!name.trim() || !image.trim() || !port.trim()) {
      alert("Please fill in all fields");
      return;
    }

    onSubmit({ name, image, port });

    // Reset form
    setName("");
    setImage(availableImages[0] || "");
    setPort("8080");
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Container">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Container Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., my-app, web-server"
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <select
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-sm"
          >
            {availableImages.map((img) => (
              <option key={img} value={img}>
                {img}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Port</label>
          <input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="e.g., 8080"
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-sm"
          />
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 rounded border px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Create Container
          </button>
        </div>
      </div>
    </Modal>
  );
}
