"use client";
import React, { useState } from "react";
import Modal from "./Modal";
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
};

type DockerImage = {
  id: string;
  name: string;
  tags: string[];
};

const TABS = ["Home", "Pods", "Images", "Settings"];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// dummy user data
const DUMMY_USER = {
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  createdAt: "2025-01-15",
};

// dummy images
const DUMMY_IMAGES: DockerImage[] = [
  { id: "img1", name: "alpine", tags: ["latest", "3.18", "3.17"] },
  { id: "img2", name: "node", tags: ["latest", "20", "18"] },
  { id: "img3", name: "postgres", tags: ["latest", "15", "14"] },
  { id: "img4", name: "nginx", tags: ["latest", "alpine"] },
];

export default function Tabs() {
  const [active, setActive] = useState<number>(0);
  const [containers, setContainers] = useState<Container[]>([]);
  const [openContainerId, setOpenContainerId] = useState<string | null>(null);
  const [images, setImages] = useState<DockerImage[]>(DUMMY_IMAGES);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  function createContainer() {
    const id = generateId();
    const newC: Container = {
      id,
      name: `container-${id}`,
      image: "alpine:latest",
      status: "initializing",
      logs: ["[init] creating container..."],
      createdAt: Date.now(),
    };

    setContainers((s) => [newC, ...s]);
    setOpenContainerId(id);

    // simulate logs and status updates
    setTimeout(() => {
      setContainers((s) =>
        s.map((c) =>
          c.id === id
            ? { ...c, logs: [...c.logs, "[init] pulling image", "[init] starting..."], status: "running" }
            : c
        )
      );
    }, 1200);

    setTimeout(() => {
      setContainers((s) =>
        s.map((c) => (c.id === id ? { ...c, logs: [...c.logs, "[info] container running"] } : c))
      );
    }, 2200);
  }

  function deleteImageTag(imageId: string, tag: string) {
    setImages((s) =>
      s.map((img) =>
        img.id === imageId
          ? { ...img, tags: img.tags.filter((t) => t !== tag) }
          : img
      ).filter((img) => img.tags.length > 0)
    );
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
                onClick={createContainer}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Create New Container
              </button>
            )}
            {active === 1 && (
              <button className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition">
                New Pod
              </button>
            )}
            {active === 2 && (
              <button className="rounded bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition">
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
                onCreateContainer={createContainer}
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
              <ImagesTab images={images} onDeleteTag={deleteImageTag} />
            )}

            {/* Settings Tab */}
            {active === 3 && <SettingsTab />}
          </main>
        </div>
      </div>

      {/* Logs Modal */}
      <Modal
        open={!!openContainerId}
        onClose={() => setOpenContainerId(null)}
        title={openContainerId ? `${containers.find((c) => c.id === openContainerId)?.name ?? "Container"} Logs` : "Logs"}
      >
        <div className="space-y-2">
          <div className="max-h-96 overflow-auto bg-black/5 p-4 rounded text-xs font-mono dark:bg-white/5 dark:text-white">
            {openContainerId && containers.find((c) => c.id === openContainerId) ? (
              containers
                .find((c) => c.id === openContainerId)
                ?.logs.map((l, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {l}
                  </div>
                ))
            ) : (
              <div>No logs available</div>
            )}
          </div>
          <button
            onClick={() => setOpenContainerId(null)}
            className="w-full rounded bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
