"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import CreateContainerModal from "./CreateContainerModal";
import AddImageModal from "./AddImageModal";
import HomeTab from "./home";
import PodsTab from "./pods";
import ImagesTab from "./image";
import SettingsTab from "./settings";

type Container = {
  id: string;
  name: string;
  image: string;
  status: "initializing" | "running" | "stopped";
  logs: string[];
  createdAt: number;
  ports?: string[]; // e.g., ["8080:3000", "5432:5432"]
};

type DockerImage = {
  id: string;
  name: string;
  tags: string[];
};

const TABS = ["Home", "Pods", "Images", "Settings"];

// Static image list for dropdowns (TODO: Replace with backend API call)
const STATIC_IMAGES = ["alpine:latest", "node:18", "postgres:15", "nginx:latest", "redis:7", "mysql:8"];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function Tabs() {
  const [active, setActive] = useState<number>(0);
  const [containers, setContainers] = useState<Container[]>([]);
  const [openContainerId, setOpenContainerId] = useState<string | null>(null);
  const [images, setImages] = useState<DockerImage[]>([]);
  
  // Modal states
  const [showCreateContainerModal, setShowCreateContainerModal] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);

  function handleCreateContainer(data: { name: string; image: string; port: string }) {
    // TODO: Replace with actual backend API call to POST /api/containers
    const id = generateId();
    const newContainer: Container = {
      id,
      name: data.name,
      image: data.image,
      status: "initializing",
      logs: ["[init] creating container..."],
      createdAt: Date.now(),
      ports: [`${data.port}:${data.port}`],
    };

    setContainers((s) => [newContainer, ...s]);
    setOpenContainerId(id);
    setShowCreateContainerModal(false);
    console.log("Create container - awaiting backend implementation", data);
  }

  function handleAddImage(data: { repository: string; version: string }) {
    // TODO: Replace with actual backend API call to POST /api/images
    const id = `img-${generateId()}`;
    const newImage: DockerImage = {
      id,
      name: data.repository,
      tags: [data.version],
    };

    setImages((s) => [newImage, ...s]);
    setShowAddImageModal(false);
    console.log("Add image - awaiting backend implementation", data);
  }

  function deleteContainer(containerId: string) {
    // TODO: Replace with actual backend API call to DELETE /api/containers/{id}
    setContainers((s) => s.filter((c) => c.id !== containerId));
    setOpenContainerId(null);
    console.log("Delete container - awaiting backend implementation");
  }

  function deleteImageTag(imageId: string, tag: string) {
    // TODO: Replace with actual backend API call to DELETE /api/images/{id}/tags/{tag}
    setImages((s) =>
      s.map((img) =>
        img.id === imageId
          ? { ...img, tags: img.tags.filter((t) => t !== tag) }
          : img
      ).filter((img) => img.tags.length > 0)
    );
    console.log("Delete image tag - awaiting backend implementation");
  }

  function deleteImage(imageId: string) {
    // TODO: Replace with actual backend API call to DELETE /api/images/{id}
    setImages((s) => s.filter((img) => img.id !== imageId));
    console.log("Delete image - awaiting backend implementation");
  }

  const running = containers.filter((c) => c.status !== "stopped");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white p-6">
      <div className="mx-auto max-w-5xl">
        {/* Tab Navigation */}
        <header className="flex items-center justify-between border-b pb-4">
          <nav className="flex items-center gap-4">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setActive(i)}
                className={`rounded px-3 py-2 text-sm transition ${
                  i === active
                    ? "border-b-2 font-semibold border-blue-600"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </header>

        <div className="mt-4">
          {/* Action Buttons */}
          <div className="flex justify-end mb-6">
            {active === 0 && (
              <button
                 onClick={() => setShowCreateContainerModal(true)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Create New Container
              </button>
            )}
            {active === 1 && (
               <button
                 onClick={() => setShowCreateContainerModal(true)}
                 className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
               >
                New Pod
              </button>
            )}
            {active === 2 && (
               <button
                 onClick={() => setShowAddImageModal(true)}
                 className="rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
               >
                Add Image
              </button>
            )}
          </div>

          <main>
            {/* Home Tab */}
            {active === 0 && (
              <HomeTab
                running={running}
                containers={containers}
                onViewLogs={setOpenContainerId}
              />
            )}

            {/* Pods Tab */}
            {active === 1 && (
              <PodsTab
                containers={containers}
                onViewDetails={setOpenContainerId}
              />
            )}

            {/* Images Tab */}
            {active === 2 && (
              <ImagesTab 
                images={images} 
                onDeleteTag={deleteImageTag}
                onDeleteImage={deleteImage}
              />
            )}

            {/* Settings Tab */}
            {active === 3 && <SettingsTab />}
          </main>
        </div>
      </div>

      {/* Container Details Modal */}
      <Modal
        open={!!openContainerId}
        onClose={() => setOpenContainerId(null)}
        title={openContainerId ? `${containers.find((c) => c.id === openContainerId)?.name ?? "Container"}` : "Container"}
      >
        {openContainerId && containers.find((c) => c.id === openContainerId) && (() => {
          const container = containers.find((c) => c.id === openContainerId)!;
          return (
            <div className="space-y-4">
              {/* Container Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Container ID</label>
                  <p className="text-sm font-mono">{container.id}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Name</label>
                  <p className="text-sm">{container.name}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Image</label>
                  <p className="text-sm">{container.image}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        container.status === "running"
                          ? "bg-green-500"
                          : container.status === "initializing"
                            ? "bg-yellow-400"
                            : "bg-gray-400"
                      }`}
                    />
                    <p className="text-sm capitalize">{container.status}</p>
                  </div>
                </div>
                {container.ports && container.ports.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Port Bindings</label>
                    <div className="text-sm space-y-1 mt-1">
                      {container.ports.map((port, i) => (
                        <div key={i} className="font-mono text-xs">{port}</div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Created</label>
                  <p className="text-sm">{new Date(container.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Logs Section */}
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block mb-2">Live Logs</label>
                <div className="max-h-64 overflow-auto bg-black/5 p-3 rounded text-xs font-mono dark:bg-white/5 dark:text-white">
                  {container.logs.length === 0 ? (
                    <div className="text-zinc-500">No logs available</div>
                  ) : (
                    container.logs.map((l, i) => (
                      <div key={i} className="whitespace-pre-wrap">
                        {l}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => setOpenContainerId(null)}
                  className="flex-1 rounded border px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => deleteContainer(container.id)}
                  className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                >
                  Delete Container
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

        {/* Create Container Modal */}
        <CreateContainerModal
          open={showCreateContainerModal}
          onClose={() => setShowCreateContainerModal(false)}
          onSubmit={handleCreateContainer}
          availableImages={STATIC_IMAGES}
        />

        {/* Add Image Modal */}
        <AddImageModal
          open={showAddImageModal}
          onClose={() => setShowAddImageModal(false)}
          onSubmit={handleAddImage}
        />
    </div>
  );
}
