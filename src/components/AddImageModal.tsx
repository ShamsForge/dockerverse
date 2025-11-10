"use client";
import React, { useState } from "react";
import Modal from "./Modal";

type AddImageModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { repository: string; version: string }) => void;
};

export default function AddImageModal({
  open,
  onClose,
  onSubmit,
}: AddImageModalProps) {
  const [repository, setRepository] = useState("");
  const [version, setVersion] = useState("latest");

  const handleSubmit = () => {
    if (!repository.trim()) {
      alert("Please enter a repository name");
      return;
    }

    onSubmit({ repository, version });

    // Reset form
    setRepository("");
    setVersion("latest");
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Docker Image">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Docker Hub Repository
          </label>
          <input
            type="text"
            value={repository}
            onChange={(e) => setRepository(e.target.value)}
            placeholder="e.g., node, postgres, nginx"
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-sm"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Enter the image name from Docker Hub (without the version tag)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Version</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g., latest, 18, 15"
            className="w-full rounded border px-3 py-2 bg-white dark:bg-zinc-800 text-sm"
          />
          <p className="text-xs text-zinc-500 mt-1">Default: latest</p>
        </div>

        <div className="p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-900 dark:text-blue-100">
          <strong>Image:</strong> {repository}:{version}
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
            className="flex-1 rounded bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
          >
            Add Image
          </button>
        </div>
      </div>
    </Modal>
  );
}
